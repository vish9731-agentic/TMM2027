package com.tmm2027.runner

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.location.Location
import android.os.Binder
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.os.PowerManager
import android.os.SystemClock
import android.util.Log
import androidx.core.app.NotificationCompat
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.io.File

/**
 * Android Foreground Service managing the active workout run:
 * - Keeps CPU awake via WakeLock
 * - Streams GPS data in background
 * - Orchestrates YouTube Music 10% audio ducking & 5-4-3-2-1 countdowns
 * - Handles distance & time triggers + compulsory fueling
 */
class WorkoutAudioService : Service(), EarbudMediaReceiver.Companion.EarbudButtonListener {

    private val binder = LocalBinder()
    private val handler = Handler(Looper.getMainLooper())

    private lateinit var audioCueManager: AudioCueManager
    private lateinit var paceCoachEngine: PaceCoachEngine
    private lateinit var cadenceMetronome: CadenceMetronome
    private lateinit var fusedLocationClient: FusedLocationProviderClient

    private var wakeLock: PowerManager.WakeLock? = null
    private var isRunning = false
    private var isPaused = false

    private var startTimeMs = 0L
    private var elapsedSeconds = 0
    private var totalDistanceMeters = 0.0
    private var lastLocation: Location? = null

    private var lastSpokenCue = "Workout Started"
    private var activeTimeline = mutableListOf<AudioEvent>()
    private val triggeredEventIds = mutableSetOf<String>()

    data class AudioEvent(
        val id: String,
        val type: String,
        val triggerType: String,
        val triggerSeconds: Int? = null,
        val triggerDistanceKm: Double? = null,
        val title: String,
        val text: String,
        val duckMusicSeconds: Double = 1.5,
        val hasCountdown: Boolean = false,
        val countdownStartSecond: Int? = null
    )

    inner class LocalBinder : Binder() {
        fun getService(): WorkoutAudioService = this@WorkoutAudioService
    }

    override fun onBind(intent: Intent?): IBinder = binder

    override fun onCreate() {
        super.onCreate()
        Log.d("WorkoutAudioService", "Creating WorkoutAudioService...")

        audioCueManager = AudioCueManager(this)
        paceCoachEngine = PaceCoachEngine(audioCueManager)
        cadenceMetronome = CadenceMetronome(audioCueManager)
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        EarbudMediaReceiver.listener = this

        val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
        wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "TMM2027::RunningServiceWakeLock")
        wakeLock?.acquire(4 * 60 * 60 * 1000L) // 4 hours max

        createNotificationChannel()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "TMM Audio Coach Run",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Active Marathon Training Run Session"
                setShowBadge(false)
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(contentText: String): Notification {
        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_SINGLE_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            this, 0, intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("🏃 TMM 2027 Audio Coach Active")
            .setContentText(contentText)
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setOngoing(true)
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    fun startWorkout(manifestJsonStr: String? = null, isFastTestMode: Boolean = false) {
        if (isRunning) return
        isRunning = true
        isPaused = false
        startTimeMs = SystemClock.elapsedRealtime()
        elapsedSeconds = 0
        totalDistanceMeters = 0.0
        triggeredEventIds.clear()

        loadManifest(manifestJsonStr, isFastTestMode)

        startForeground(NOTIFICATION_ID, buildNotification("Starting Workout..."))
        startLocationUpdates()

        // Opening briefing
        audioCueManager.playDirectCue("Starting workout. YouTube music will duck automatically during cues. Enjoy your run!")
        handler.post(tickerRunnable)
    }

    private fun loadManifest(manifestJsonStr: String?, isFastTestMode: Boolean) {
        activeTimeline.clear()

        if (isFastTestMode) {
            // Fast 60-Second Simulator Mode for testing ducking, intervals and countdowns
            Log.d("WorkoutAudioService", "Loading 60-Second Fast Simulator Timeline")
            activeTimeline.add(AudioEvent("fast_start", "START", "TIME", 0, null, "🚀 Start Run", "Starting fast interval test.", 1.5, false))
            activeTimeline.add(AudioEvent("fast_int_pre", "INTERVAL_PRE_CUE", "TIME", 8, null, "🔥 Interval 1 (Pre-Cue)", "1 minute hard effort starts in 5 seconds. Target pace 5:45.", 1.5, true, 10))
            activeTimeline.add(AudioEvent("fast_int_start", "INTERVAL_START", "TIME", 15, null, "⚡ Interval 1 Started", "GO! Push the pace.", 0.5, false))
            activeTimeline.add(AudioEvent("fast_fuel", "FUELING", "TIME", 30, null, "💧 Fueling Alert", "Fueling check: take 1 salt capsule with water.", 1.5, false))
            activeTimeline.add(AudioEvent("fast_rest_pre", "REST_PRE_CUE", "TIME", 40, null, "🧘 Rest (Pre-Cue)", "Rest in 5 seconds. 30 seconds easy walk.", 1.5, true, 42))
            activeTimeline.add(AudioEvent("fast_rest_start", "REST_START", "TIME", 47, null, "🧘 Rest Started", "Rest and recover.", 1.0, false))
            activeTimeline.add(AudioEvent("fast_complete", "COMPLETE", "TIME", 58, null, "🏆 Test Complete", "60-second test completed successfully!", 1.5, false))
            return
        }

        if (!manifestJsonStr.isNullOrEmpty()) {
            try {
                val gson = Gson()
                val mapType = object : TypeToken<Map<String, Any>>() {}.type
                val map: Map<String, Any> = gson.fromJson(manifestJsonStr, mapType)
                val timelineList = map["timeline"] as? List<Map<String, Any>>
                
                timelineList?.forEach { item ->
                    activeTimeline.add(
                        AudioEvent(
                            id = item["id"] as? String ?: "event_${System.currentTimeMillis()}",
                            type = item["type"] as? String ?: "CUE",
                            triggerType = item["triggerType"] as? String ?: "TIME",
                            triggerSeconds = (item["triggerSeconds"] as? Number)?.toInt(),
                            triggerDistanceKm = (item["triggerDistanceKm"] as? Number)?.toDouble(),
                            title = item["title"] as? String ?: "Cue",
                            text = item["text"] as? String ?: "",
                            duckMusicSeconds = (item["duckMusicSeconds"] as? Number)?.toDouble() ?: 1.5,
                            hasCountdown = item["hasCountdown"] as? Boolean ?: false,
                            countdownStartSecond = (item["countdownStartSecond"] as? Number)?.toInt()
                        )
                    )
                }
            } catch (e: Exception) {
                Log.e("WorkoutAudioService", "Error parsing manifest: ${e.message}")
            }
        }
    }

    private val tickerRunnable = object : Runnable {
        override fun run() {
            if (!isRunning || isPaused) return

            elapsedSeconds++
            checkTriggers()

            // Update Notification every 5 seconds
            if (elapsedSeconds % 5 == 0) {
                val distKm = totalDistanceMeters / 1000.0
                val pace = paceCoachEngine.getCurrentPaceFormatted()
                val mins = elapsedSeconds / 60
                val secs = elapsedSeconds % 60
                val statusText = String.format("%02d:%02d • %.2f km • Pace %s", mins, secs, distKm, pace)
                val manager = getSystemService(NotificationManager::class.java)
                manager?.notify(NOTIFICATION_ID, buildNotification(statusText))
            }

            handler.postDelayed(this, 1000L)
        }
    }

    private fun checkTriggers() {
        val currentDistKm = totalDistanceMeters / 1000.0

        for (event in activeTimeline) {
            if (triggeredEventIds.contains(event.id)) continue

            var shouldTrigger = false

            // Check Time-based trigger
            if (event.triggerType == "TIME" || event.triggerType == "DISTANCE_OR_TIME") {
                if (event.triggerSeconds != null && elapsedSeconds >= event.triggerSeconds) {
                    shouldTrigger = true
                }
            }

            // Check Distance-based trigger
            if (event.triggerType == "DISTANCE" || event.triggerType == "DISTANCE_OR_TIME") {
                if (event.triggerDistanceKm != null && currentDistKm >= event.triggerDistanceKm) {
                    shouldTrigger = true
                }
            }

            if (shouldTrigger) {
                triggeredEventIds.add(event.id)
                lastSpokenCue = event.text
                Log.d("WorkoutAudioService", "🔥 Triggered Event: ${event.title}")

                if (event.hasCountdown) {
                    audioCueManager.playCueWithCountdown(event.text) {
                        Log.d("WorkoutAudioService", "Interval Started - Audio Focus Released")
                    }
                } else {
                    audioCueManager.playDirectCue(event.text)
                }
                break // Handle one cue per second to avoid collisions
            }
        }
    }

    private val locationCallback = object : LocationCallback() {
        override fun onLocationResult(result: LocationResult) {
            for (location in result.locations) {
                if (lastLocation != null) {
                    val dist = lastLocation!!.distanceTo(location)
                    if (dist > 0.5f && dist < 50f) { // Filter GPS jumps
                        totalDistanceMeters += dist
                    }
                }
                lastLocation = location
                paceCoachEngine.onLocationUpdate(location)
            }
        }
    }

    private fun startLocationUpdates() {
        try {
            val locationRequest = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, 2000L)
                .setMinUpdateIntervalMillis(1000L)
                .build()

            fusedLocationClient.requestLocationUpdates(locationRequest, locationCallback, Looper.getMainLooper())
        } catch (e: SecurityException) {
            Log.e("WorkoutAudioService", "Location permission missing: ${e.message}")
        }
    }

    override fun onDoubleTap() {
        Log.d("WorkoutAudioService", "Earbud Double Tap -> Replaying last cue")
        audioCueManager.playDirectCue("Replaying: $lastSpokenCue")
    }

    override fun onTripleTap() {
        Log.d("WorkoutAudioService", "Earbud Triple Tap -> Skipping current interval")
        audioCueManager.playDirectCue("Skipping to next interval.")
        // Fast-forward to next uncompleted interval trigger
    }

    fun toggleCadenceMetronome(enable: Boolean, bpm: Int = 170) {
        if (enable) cadenceMetronome.start(bpm) else cadenceMetronome.stop()
    }

    fun stopWorkout() {
        isRunning = false
        handler.removeCallbacks(tickerRunnable)
        fusedLocationClient.removeLocationUpdates(locationCallback)
        cadenceMetronome.stop()
        audioCueManager.playDirectCue("Workout finished! Fantastic job.")
        stopForeground(STOP_FOREGROUND_REMOVE)
        wakeLock?.release()
        stopSelf()
    }

    override fun onDestroy() {
        super.onDestroy()
        audioCueManager.shutdown()
        if (wakeLock?.isHeld == true) wakeLock?.release()
    }

    companion object {
        const val CHANNEL_ID = "tmm_workout_channel"
        const val NOTIFICATION_ID = 2027
    }
}
