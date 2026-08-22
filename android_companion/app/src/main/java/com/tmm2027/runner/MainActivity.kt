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
import com.google.gson.Gson
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.File

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
    private lateinit var switchMetronome: Switch

    private var loadedManifestJson: String? = null

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
        switchMetronome = findViewById(R.id.switchMetronome)

        btnStart.setOnClickListener {
            if (!isWorkoutActive) {
                startFullWorkout()
            } else {
                stopFullWorkout()
            }
        }

        btnFastTest.setOnClickListener {
            startFastTest()
        }

        switchMetronome.setOnCheckedChangeListener { _, isChecked ->
            workoutService?.toggleCadenceMetronome(isChecked, 170)
        }

        loadWorkoutManifest()
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

    private fun loadWorkoutManifest() {
        // Look for local manifest file or fetch default
        tvWorkoutTitle.text = "Loading Tomorrow's Workout..."
        
        CoroutineScope(Dispatchers.IO).launch {
            // Default sample fallback
            val fallbackJson = """
            {
                "workoutType": "Speed Intervals",
                "distanceKm": 7.0,
                "targetPace": "5:45 - 6:00 min/km",
                "rpeTarget": 8,
                "openingBriefing": {
                    "title": "Speed Intervals (6x 1m hard / 30s rest)",
                    "weatherAdvisory": "Morning temperature 21°C, 85% humidity. Take salt capsules on time."
                }
            }
            """.trimIndent()
            
            loadedManifestJson = fallbackJson

            withContext(Dispatchers.Main) {
                tvWorkoutTitle.text = "Speed Intervals • 7.0 km"
                tvTargetPace.text = "🎯 Target: 5:45 - 6:00 min/km (RPE 8)"
                tvWeatherAdvisory.text = "🌤️ Morning 21°C (85% humidity) • Salt Capsule @ 45m"
                tvStatus.text = "Ready to start run. YouTube Music will duck automatically to 10%."
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
            workoutService?.startWorkout(loadedManifestJson, false)
            isWorkoutActive = true
            btnStart.text = "STOP WORKOUT"
            btnStart.setBackgroundColor(0xFFE11D48.toInt())
            tvStatus.text = "🏃 Active Run in Progress (Screen can be locked now)"
        }, 300)
    }

    private fun startFastTest() {
        Toast.makeText(this, "Starting 60s Fast Test. Play YouTube Music now!", Toast.LENGTH_LONG).show()
        val intent = Intent(this, WorkoutAudioService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(intent)
        } else {
            startService(intent)
        }
        bindService(intent, serviceConnection, Context.BIND_AUTO_CREATE)

        btnFastTest.postDelayed({
            workoutService?.startWorkout(null, true)
            isWorkoutActive = true
            btnStart.text = "STOP WORKOUT"
            tvStatus.text = "⚡ 60-Sec Test Running: Watch YouTube Music duck to 10%!"
        }, 300)
    }

    private fun stopFullWorkout() {
        workoutService?.stopWorkout()
        if (isBound) {
            unbindService(serviceConnection)
            isBound = false
        }
        isWorkoutActive = false
        btnStart.text = "START RUN"
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
