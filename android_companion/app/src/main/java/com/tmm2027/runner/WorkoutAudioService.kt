package com.tmm2027.runner

import android.annotation.SuppressLint
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

/**
 * Production Android Foreground Service for marathon audio coaching.
 * Manages 10% YouTube Music audio ducking, zero-latency countdowns, GPS pace smoothing,
 * and compulsory fueling alarms with screen off / phone in pocket.
 */
class WorkoutAudioService : Service() {

    inner class LocalBinder : Binder() {
        fun getService(): WorkoutAudioService = this@WorkoutAudioService
    }

    private val binder = LocalBinder()
    private val handler = Handler(Looper.getMainLooper())

    private lateinit var audioCueManager: AudioCueManager
    private lateinit var paceCoachEngine: PaceCoachEngine
    private lateinit var cadenceMetronome: CadenceMetronome
    private lateinit var fusedLocationClient: FusedLocationProviderClient

    private var wakeLock: PowerManager.WakeLock? = null
    private var isRunning = false
    private var isPaused = false

    private var startTimeMs: Long = 0
    private var elapsedSeconds: Long = 0
    private var lastLocation: Location? = null
    private var totalDistanceMeters: Double = 0.0

    data class AudioEvent(
        val id: String,
        val type: String,
        val triggerType: String,
        val triggerSeconds: Int?,
        val triggerDistanceKm: Double?,
        val title: String,
        val text: String,
        val duckMusicSeconds: Double,
        val hasCountdown: Boolean,
        val countdownStartSecond: Int? = null
    )

    private val activeTimeline = mutableListOf<AudioEvent>()
    private val triggeredEventIds = mutableSetOf<String>()

    override fun onCreate() {
        super.onCreate()
        audioCueManager = AudioCueManager(this)
        paceCoachEngine = PaceCoachEngine(audioCueManager)
        cadenceMetronome = CadenceMetronome(audioCueManager)
        paceCoachEngine.cadenceMetronome = cadenceMetronome
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

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

    fun startWorkout(manifestJsonStr: String? = null) {
        if (isRunning) return
        isRunning = true
        isPaused = false
        startTimeMs = SystemClock.elapsedRealtime()
        elapsedSeconds = 0
        totalDistanceMeters = 0.0
        triggeredEventIds.clear()

        loadManifest(manifestJsonStr)

        startForeground(NOTIFICATION_ID, buildNotification("Starting Workout..."))
        startLocationUpdates()

        audioCueManager.playDirectCue("Starting workout. YouTube music will duck automatically during cues. Enjoy your run!")
        handler.post(tickerRunnable)
    }

    private fun loadManifest(manifestJsonStr: String?) {
        activeTimeline.clear()

        if (!manifestJsonStr.isNullOrEmpty()) {
            try {
                val gson = Gson()
                val mapType = object : TypeToken<Map<String, Any>>() {}.type
                val map: Map<String, Any> = gson.fromJson(manifestJsonStr, mapType)
                val timelineList = map["timeline"] as? List<Map<String, Any>>
                
                val targetPace = map["targetPace"] as? String
                if (!targetPace.isNullOrEmpty()) {
                    paceCoachEngine.setTargetPace(targetPace)
                }

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
            if (elapsedSeconds % 5 == 0L) {
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

            // Time Trigger
            if (event.triggerType == "TIME" && event.triggerSeconds != null) {
                if (elapsedSeconds >= event.triggerSeconds) {
                    shouldTrigger = true
                }
            }

            // Distance Trigger
            if (event.triggerType == "DISTANCE" && event.triggerDistanceKm != null) {
                if (currentDistKm >= event.triggerDistanceKm) {
                    shouldTrigger = true
                }
            }

            // Distance or Time (e.g. Finish)
            if (event.triggerType == "DISTANCE_OR_TIME") {
                if ((event.triggerDistanceKm != null && currentDistKm >= event.triggerDistanceKm) ||
                    (event.triggerSeconds != null && elapsedSeconds >= event.triggerSeconds)) {
                    shouldTrigger = true
                }
            }

            if (shouldTrigger) {
                triggeredEventIds.add(event.id)
                fireAudioEvent(event)
            }
        }
    }

    private fun fireAudioEvent(event: AudioEvent) {
        Log.d("WorkoutAudioService", "Firing Audio Event: ${event.title} - ${event.text}")

        if (event.hasCountdown) {
            audioCueManager.playCueWithCountdown(
                promptText = event.text,
                onStartGo = {}
            )
        } else {
            audioCueManager.playDirectCue(
                promptText = event.text
            )
        }
    }

    @SuppressLint("MissingPermission")
    private fun startLocationUpdates() {
        val locationRequest = LocationRequest.Builder(
            Priority.PRIORITY_HIGH_ACCURACY,
            2000L
        ).setMinUpdateIntervalMillis(1000L).build()

        try {
            fusedLocationClient.requestLocationUpdates(
                locationRequest,
                locationCallback,
                Looper.getMainLooper()
            )
        } catch (e: Exception) {
            Log.w("WorkoutAudioService", "Location permission missing or error: ${e.message}")
        }
    }

    private val locationCallback = object : LocationCallback() {
        override fun onLocationResult(locationResult: LocationResult) {
            val location = locationResult.lastLocation ?: return

            if (lastLocation != null) {
                val distanceStep = lastLocation!!.distanceTo(location)
                if (distanceStep > 0 && distanceStep < 100) { // filter GPS jitter
                    totalDistanceMeters += distanceStep
                }
            }
            lastLocation = location

            // Send location to Pace Coach smoothing engine
            paceCoachEngine.onLocationUpdate(location)
        }
    }

    fun setCadenceMode(mode: CadenceMetronome.Mode, bpm: Int = 170) {
        when (mode) {
            CadenceMetronome.Mode.OFF -> cadenceMetronome.stop()
            CadenceMetronome.Mode.FIXED_BPM -> cadenceMetronome.startFixed(bpm)
            CadenceMetronome.Mode.AUTO_PACE_SYNC -> cadenceMetronome.startAutoPaceSync(bpm)
        }
    }

    fun toggleCadenceMetronome(enabled: Boolean, bpm: Int = 170) {
        if (enabled) {
            cadenceMetronome.startAutoPaceSync(bpm)
        } else {
            cadenceMetronome.stop()
        }
    }

    fun stopWorkout() {
        isRunning = false
        handler.removeCallbacks(tickerRunnable)
        fusedLocationClient.removeLocationUpdates(locationCallback)
        cadenceMetronome.stop()
        audioCueManager.shutdown()

        try {
            wakeLock?.let {
                if (it.isHeld) it.release()
            }
        } catch (e: Exception) {
            // ignore
        }

        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
    }

    override fun onBind(intent: Intent?): IBinder = binder

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        stopWorkout()
    }

    companion object {
        const val CHANNEL_ID = "tmm_workout_audio_channel"
        const val NOTIFICATION_ID = 2027
    }
}
