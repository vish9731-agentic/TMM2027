package com.tmm2027.runner

import android.Manifest
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import android.widget.Button
import android.widget.Switch
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class MainActivity : AppCompatActivity() {

    private var workoutService: WorkoutAudioService? = null
    private var isBound = false
    private var isWorkoutActive = false

    private lateinit var tvWorkoutTitle: TextView
    private lateinit var tvTargetPace: TextView
    private lateinit var tvWeatherAdvisory: TextView
    private lateinit var tvStatus: TextView
    private lateinit var btnStart: Button
    private lateinit var btnFastTest: Button
    private lateinit var btnSundayTest: Button
    private lateinit var switchMetronome: Switch

    private var loadedManifestJson: String? = null
    private var selectedDateStr: String = ""

    private val serviceConnection = object : ServiceConnection {
        override fun onServiceConnected(name: ComponentName?, service: IBinder?) {
            val binder = service as WorkoutAudioService.LocalBinder
            workoutService = binder.getService()
            isBound = true
        }

        override fun onServiceDisconnected(name: ComponentName?) {
            workoutService = null
            isBound = false
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        checkAndRequestPermissions()

        tvWorkoutTitle = findViewById(R.id.tvWorkoutTitle)
        tvTargetPace = findViewById(R.id.tvTargetPace)
        tvWeatherAdvisory = findViewById(R.id.tvWeatherAdvisory)
        tvStatus = findViewById(R.id.tvStatus)
        btnStart = findViewById(R.id.btnStart)
        btnFastTest = findViewById(R.id.btnFastTest)
        btnSundayTest = findViewById(R.id.btnSundayTest)
        switchMetronome = findViewById(R.id.switchMetronome)

        btnStart.setOnClickListener {
            if (!isWorkoutActive) {
                startFullWorkout()
            } else {
                stopFullWorkout()
            }
        }

        btnSundayTest.setOnClickListener {
            startSundayPreview()
        }

        btnFastTest.setOnClickListener {
            startFastIntervalsTest()
        }

        switchMetronome.setOnCheckedChangeListener { _, isChecked ->
            workoutService?.toggleCadenceMetronome(isChecked, 170)
        }

        // Auto-load tomorrow's run (or today's run)
        selectedDateStr = PlanEngine.getTodayOrTomorrowDate(isTomorrow = true)
        loadWorkoutForDate(selectedDateStr)
    }

    private fun checkAndRequestPermissions() {
        val permissions = mutableListOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            permissions.add(Manifest.permission.POST_NOTIFICATIONS)
        }

        val needed = permissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }
        if (needed.isNotEmpty()) {
            ActivityCompat.requestPermissions(this, needed.toTypedArray(), 101)
        }
    }

    private fun loadWorkoutForDate(dateStr: String) {
        tvWorkoutTitle.text = "Loading Workout for $dateStr..."
        
        CoroutineScope(Dispatchers.IO).launch {
            val workout = PlanEngine.getWorkoutForDate(this@MainActivity, dateStr)
            val manifestJson = PlanEngine.buildManifestJson(workout)
            loadedManifestJson = manifestJson

            withContext(Dispatchers.Main) {
                val prehabText = workout.strength_prehab ?: "Post-run calf armor flush"
                tvWorkoutTitle.text = "${workout.type} • ${workout.distance_km} km"
                tvTargetPace.text = "🎯 Target: ${workout.target_pace} (RPE ${workout.rpe}/10)"
                tvWeatherAdvisory.text = "📅 ${workout.day}, $dateStr • ${prehabText}"
                tvStatus.text = "Ready. Start YouTube Music, then tap 'START RUN'."
            }
        }
    }

    private fun startFullWorkout() {
        val intent = Intent(this, WorkoutAudioService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(intent)
        } else {
            startService(intent)
        }
        bindService(intent, serviceConnection, Context.BIND_AUTO_CREATE)

        btnStart.postDelayed({
            workoutService?.startWorkout(loadedManifestJson, "NONE")
            isWorkoutActive = true
            btnStart.text = "STOP WORKOUT"
            btnStart.setBackgroundColor(0xFFE11D48.toInt())
            tvStatus.text = "🏃 Active Run in Progress (Screen can be locked now)"
        }, 300)
    }

    private fun startSundayPreview() {
        Toast.makeText(this, "Starting Sunday 7km Preview with YouTube Music ducking!", Toast.LENGTH_LONG).show()
        val intent = Intent(this, WorkoutAudioService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(intent)
        } else {
            startService(intent)
        }
        bindService(intent, serviceConnection, Context.BIND_AUTO_CREATE)

        btnSundayTest.postDelayed({
            workoutService?.startWorkout(null, "SUNDAY_7KM")
            isWorkoutActive = true
            btnStart.text = "STOP AUDIO PREVIEW"
            btnStart.setBackgroundColor(0xFFE11D48.toInt())
            tvStatus.text = "🏃 Previewing Sunday 7km Long Run Cues (YouTube Music ducking active)"
        }, 300)
    }

    private fun startFastIntervalsTest() {
        Toast.makeText(this, "Starting 60s Interval Test. Play YouTube Music now!", Toast.LENGTH_LONG).show()
        val intent = Intent(this, WorkoutAudioService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(intent)
        } else {
            startService(intent)
        }
        bindService(intent, serviceConnection, Context.BIND_AUTO_CREATE)

        btnFastTest.postDelayed({
            workoutService?.startWorkout(null, "FAST_INTERVALS")
            isWorkoutActive = true
            btnStart.text = "STOP TEST"
            btnStart.setBackgroundColor(0xFFE11D48.toInt())
            tvStatus.text = "⚡ 60-Sec Interval Test Running: Watch YouTube Music duck to 10%!"
        }, 300)
    }

    private fun stopFullWorkout() {
        workoutService?.stopWorkout()
        if (isBound) {
            unbindService(serviceConnection)
            isBound = false
        }
        isWorkoutActive = false
        btnStart.text = "START RUN (GPS + LIVE CUES)"
        btnStart.setBackgroundColor(0xFF10B981.toInt())
        tvStatus.text = "Workout Complete! Great job."
    }

    override fun onDestroy() {
        super.onDestroy()
        if (isBound) {
            unbindService(serviceConnection)
            isBound = false
        }
    }
}
