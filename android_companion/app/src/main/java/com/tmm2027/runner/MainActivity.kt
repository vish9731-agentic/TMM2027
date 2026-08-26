package com.tmm2027.runner

import android.Manifest
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.content.pm.PackageManager
import android.graphics.Color
import android.graphics.Typeface
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.LinearLayout
import android.widget.Spinner
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.text.SimpleDateFormat
import java.util.Locale

/**
 * TMM 2027 Swiss Industrial & Bauhaus Runner Activity.
 * High-Contrast Bento Layout • International Orange • Precision Engine.
 */
class MainActivity : AppCompatActivity() {

    private var workoutService: WorkoutAudioService? = null
    private var isBound = false
    private var isWorkoutActive = false

    private lateinit var tvWorkoutTitle: TextView
    private lateinit var tvTargetPace: TextView
    private lateinit var tvWeatherAdvisory: TextView
    private lateinit var conicalSteelBadge: ConicalSteelBadgeView
    private lateinit var tvDayLabel: TextView
    private lateinit var btnPrevDay: Button
    private lateinit var btnNextDay: Button
    private lateinit var tvTimelineCount: TextView
    private lateinit var tvLiveCadenceBpm: TextView
    private lateinit var tvHeroDistanceNum: TextView
    private lateinit var tvHeroDistanceUnit: TextView

    private lateinit var spinnerCadence: Spinner
    private lateinit var layoutTimelineContainer: LinearLayout
    private lateinit var layoutLyricsContainer: LinearLayout
    private lateinit var btnStart: Button

    private val lyricCards = mutableListOf<LinearLayout>()
    private val lyricTexts = mutableListOf<TextView>()

    private var loadedManifestJson: String? = null
    private var currentWeekList = listOf<PlanEngine.WorkoutDay>()
    private var currentWorkoutIndex = 0
    private var activeWorkout: PlanEngine.WorkoutDay? = null

    private val cadenceOptions = listOf(
        "AUTO GOVERNOR",
        "165 SPM BASE",
        "168 SPM CRUISE",
        "170 SPM OPTIMAL",
        "172 SPM THRESHOLD",
        "175 SPM INTERVAL",
        "180 SPM SPRINT",
        "METRONOME OFF"
    )

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
        conicalSteelBadge = findViewById(R.id.conicalSteelBadge)
        tvDayLabel = findViewById(R.id.tvDayLabel)
        btnPrevDay = findViewById(R.id.btnPrevDay)
        btnNextDay = findViewById(R.id.btnNextDay)
        tvTimelineCount = findViewById(R.id.tvTimelineCount)
        tvLiveCadenceBpm = findViewById(R.id.tvLiveCadenceBpm)
        tvHeroDistanceNum = findViewById(R.id.tvHeroDistanceNum)
        tvHeroDistanceUnit = findViewById(R.id.tvHeroDistanceUnit)

        spinnerCadence = findViewById(R.id.spinnerCadence)
        layoutTimelineContainer = findViewById(R.id.layoutTimelineContainer)
        layoutLyricsContainer = findViewById(R.id.layoutLyricsContainer)
        btnStart = findViewById(R.id.btnStart)

        btnPrevDay.setOnClickListener {
            if (currentWeekList.isNotEmpty()) {
                currentWorkoutIndex = (currentWorkoutIndex - 1 + currentWeekList.size) % currentWeekList.size
                displayWorkout(currentWeekList[currentWorkoutIndex])
            }
        }

        btnNextDay.setOnClickListener {
            if (currentWeekList.isNotEmpty()) {
                currentWorkoutIndex = (currentWorkoutIndex + 1) % currentWeekList.size
                displayWorkout(currentWeekList[currentWorkoutIndex])
            }
        }

        setupCadenceSpinner()
        loadWeekWorkouts()

        btnStart.setOnClickListener {
            if (!isWorkoutActive) {
                startFullWorkout()
            } else {
                stopFullWorkout()
            }
        }
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

    private fun setupCadenceSpinner() {
        val adapter = object : ArrayAdapter<String>(this, android.R.layout.simple_spinner_dropdown_item, cadenceOptions) {
            override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
                val v = super.getView(position, convertView, parent) as TextView
                v.setTextColor(Color.parseColor("#111111"))
                v.textSize = 12f
                v.setTypeface(Typeface.MONOSPACE, Typeface.BOLD)
                return v
            }

            override fun getDropDownView(position: Int, convertView: View?, parent: ViewGroup): View {
                val v = super.getDropDownView(position, convertView, parent) as TextView
                v.setBackgroundColor(Color.parseColor("#FAF8F3"))
                v.setTextColor(if (position == 0) Color.parseColor("#F95700") else Color.parseColor("#111111"))
                v.setPadding(32, 24, 32, 24)
                v.textSize = 12f
                v.setTypeface(Typeface.MONOSPACE, Typeface.BOLD)
                return v
            }
        }
        spinnerCadence.adapter = adapter
        spinnerCadence.setSelection(0)

        spinnerCadence.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                applyCadenceSelection(position)
            }
            override fun onNothingSelected(parent: AdapterView<*>?) {}
        }
    }

    private fun applyCadenceSelection(position: Int) {
        when (position) {
            0 -> {
                tvLiveCadenceBpm.text = "170 SPM"
                tvLiveCadenceBpm.setTextColor(Color.parseColor("#F95700"))
                workoutService?.setCadenceMode(CadenceMetronome.Mode.AUTO_PACE_SYNC, 170)
            }
            1 -> {
                tvLiveCadenceBpm.text = "165 SPM"
                tvLiveCadenceBpm.setTextColor(Color.parseColor("#111111"))
                workoutService?.setCadenceMode(CadenceMetronome.Mode.FIXED_BPM, 165)
            }
            2 -> {
                tvLiveCadenceBpm.text = "168 SPM"
                tvLiveCadenceBpm.setTextColor(Color.parseColor("#111111"))
                workoutService?.setCadenceMode(CadenceMetronome.Mode.FIXED_BPM, 168)
            }
            3 -> {
                tvLiveCadenceBpm.text = "170 SPM"
                tvLiveCadenceBpm.setTextColor(Color.parseColor("#111111"))
                workoutService?.setCadenceMode(CadenceMetronome.Mode.FIXED_BPM, 170)
            }
            4 -> {
                tvLiveCadenceBpm.text = "172 SPM"
                tvLiveCadenceBpm.setTextColor(Color.parseColor("#111111"))
                workoutService?.setCadenceMode(CadenceMetronome.Mode.FIXED_BPM, 172)
            }
            5 -> {
                tvLiveCadenceBpm.text = "175 SPM"
                tvLiveCadenceBpm.setTextColor(Color.parseColor("#111111"))
                workoutService?.setCadenceMode(CadenceMetronome.Mode.FIXED_BPM, 175)
            }
            6 -> {
                tvLiveCadenceBpm.text = "180 SPM"
                tvLiveCadenceBpm.setTextColor(Color.parseColor("#111111"))
                workoutService?.setCadenceMode(CadenceMetronome.Mode.FIXED_BPM, 180)
            }
            7 -> {
                tvLiveCadenceBpm.text = "OFF"
                tvLiveCadenceBpm.setTextColor(Color.parseColor("#6B7280"))
                workoutService?.setCadenceMode(CadenceMetronome.Mode.OFF)
            }
        }
    }

    private fun loadWeekWorkouts() {
        val todayStr = PlanEngine.getTodayOrTomorrowDate(isTomorrow = false)

        CoroutineScope(Dispatchers.IO).launch {
            val list = PlanEngine.getWeekWorkouts(this@MainActivity, todayStr)
            currentWeekList = list

            withContext(Dispatchers.Main) {
                var defaultIndex = list.indexOfFirst { it.date == todayStr }
                if (defaultIndex == -1) {
                    defaultIndex = list.indexOfFirst { it.type.contains("Long", ignoreCase = true) }
                }
                if (defaultIndex == -1 && list.isNotEmpty()) {
                    defaultIndex = 0
                }
                if (defaultIndex != -1 && list.isNotEmpty()) {
                    currentWorkoutIndex = defaultIndex
                    displayWorkout(list[defaultIndex])
                }
            }
        }
    }

    private fun formatShortDate(dateStr: String): String {
        return try {
            val inFormat = SimpleDateFormat("yyyy-MM-dd", Locale.US)
            val outFormat = SimpleDateFormat("MMM d", Locale.US)
            val d = inFormat.parse(dateStr)
            d?.let { outFormat.format(it).uppercase() } ?: dateStr
        } catch (e: Exception) {
            dateStr
        }
    }

    private fun displayWorkout(wo: PlanEngine.WorkoutDay) {
        activeWorkout = wo
        conicalSteelBadge.setWeekText("WK ${String.format("%02d", wo.week_number)}")
        val shortDate = formatShortDate(wo.date)
        tvDayLabel.text = "day: ${wo.day.uppercase()} (${shortDate})"
        
        if (wo.distance_km > 0) {
            tvHeroDistanceNum.text = String.format("%.1f", wo.distance_km)
            tvHeroDistanceUnit.text = "KM"
        } else if (wo.type.contains("Strength", ignoreCase = true)) {
            tvHeroDistanceNum.text = "STR"
            tvHeroDistanceUnit.text = "GYM"
        } else {
            tvHeroDistanceNum.text = "OFF"
            tvHeroDistanceUnit.text = "REST"
        }

        tvWorkoutTitle.text = wo.type
        tvTargetPace.text = "Target: ${wo.target_pace}"
        val prehabText = wo.strength_prehab ?: "Post-run calf and quad flush"
        tvWeatherAdvisory.text = "RPE ${wo.rpe}/10 • ${prehabText}"

        val manifestJson = PlanEngine.buildManifestJson(wo)
        loadedManifestJson = manifestJson

        val gson = Gson()
        val mapType = object : TypeToken<Map<String, Any>>() {}.type
        val manifestMap: Map<String, Any> = gson.fromJson(manifestJson, mapType)
        val timelineList = manifestMap["timeline"] as? List<Map<String, Any>> ?: emptyList()

        tvTimelineCount.text = "${timelineList.size} MILESTONES"
        renderTimeline(timelineList)
        renderLyrics(timelineList)
    }

    private fun renderTimeline(timelineList: List<Map<String, Any>>) {
        layoutTimelineContainer.removeAllViews()

        for ((index, item) in timelineList.withIndex()) {
            val title = item["title"] as? String ?: "Milestone"
            val text = item["text"] as? String ?: ""
            val type = item["type"] as? String ?: "CUE"
            val triggerType = item["triggerType"] as? String ?: "TIME"
            val triggerSec = (item["triggerSeconds"] as? Number)?.toInt()
            val triggerKm = (item["triggerDistanceKm"] as? Number)?.toDouble()

            val cleanTitle = title.replace(Regex("[^\u0000-\u007F]"), "").trim()

            var triggerBadge = "TRIGGER"
            var isOrange = false

            if (type == "SESSION_START") {
                triggerBadge = "10% DUCKING"
            } else if (type == "FUELING") {
                triggerBadge = "COMPULSORY"
                isOrange = true
            } else if (type == "SESSION_COMPLETE") {
                triggerBadge = "COMPLETE"
                isOrange = true
            } else if (triggerType == "DISTANCE" && triggerKm != null) {
                triggerBadge = "${triggerKm} KM SPLIT"
            } else if (triggerSec != null) {
                val mins = triggerSec / 60
                val secs = triggerSec % 60
                triggerBadge = String.format("%02d:%02d", mins, secs)
            }

            val rowLayout = LinearLayout(this).apply {
                orientation = LinearLayout.HORIZONTAL
                gravity = Gravity.CENTER_VERTICAL
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(0, 4, 0, 4)
                }
            }

            // Swiss Index Number (01, 02...)
            val numView = TextView(this).apply {
                this.text = String.format("%02d", index + 1)
                setTextColor(Color.parseColor("#F95700"))
                textSize = 11f
                setTypeface(Typeface.MONOSPACE, Typeface.BOLD)
                layoutParams = LinearLayout.LayoutParams(60, LinearLayout.LayoutParams.WRAP_CONTENT)
            }

            val contentLayout = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                layoutParams = LinearLayout.LayoutParams(
                    0,
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    1f
                )
            }

            val titleView = TextView(this).apply {
                this.text = if (cleanTitle.isNotEmpty()) cleanTitle else title
                setTextColor(Color.parseColor("#111111"))
                textSize = 13f
                setTypeface(null, Typeface.BOLD)
            }

            val descView = TextView(this).apply {
                this.text = text
                setTextColor(Color.parseColor("#6B7280"))
                textSize = 11f
                setPadding(0, 2, 0, 0)
            }

            contentLayout.addView(titleView)
            contentLayout.addView(descView)

            val badgeView = TextView(this).apply {
                this.text = triggerBadge
                textSize = 9f
                setTypeface(Typeface.MONOSPACE, Typeface.BOLD)
                if (isOrange) {
                    setTextColor(Color.WHITE)
                    setBackgroundResource(R.drawable.bg_swiss_pill_orange)
                } else {
                    setTextColor(Color.parseColor("#111111"))
                    setBackgroundResource(R.drawable.bg_swiss_pill)
                }
                setPadding(14, 4, 14, 4)
            }

            rowLayout.addView(numView)
            rowLayout.addView(contentLayout)
            rowLayout.addView(badgeView)

            layoutTimelineContainer.addView(rowLayout)

            // Hairline separator between items
            if (index < timelineList.size - 1) {
                val divider = View(this).apply {
                    layoutParams = LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,
                        (1f * resources.displayMetrics.density).toInt().coerceAtLeast(1)
                    ).apply {
                        setMargins(0, 8, 0, 8)
                    }
                    setBackgroundColor(Color.parseColor("#EBE8DC"))
                }
                layoutTimelineContainer.addView(divider)
            }
        }
    }

    private fun renderLyrics(timelineList: List<Map<String, Any>>) {
        layoutLyricsContainer.removeAllViews()
        lyricCards.clear()
        lyricTexts.clear()

        for ((index, item) in timelineList.withIndex()) {
            val title = item["title"] as? String ?: "Cue"
            val text = item["text"] as? String ?: ""
            val triggerSec = (item["triggerSeconds"] as? Number)?.toInt()
            val triggerKm = (item["triggerDistanceKm"] as? Number)?.toDouble()

            var pill = title.replace(Regex("[^\u0000-\u007F]"), "").trim()
            if (triggerKm != null) pill = "${triggerKm} KM • SPLIT"
            else if (triggerSec != null) {
                val mins = triggerSec / 60
                val secs = triggerSec % 60
                pill = String.format("%02d:%02d", mins, secs)
            }

            val card = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(0, 0, 0, 10)
                }
                setBackgroundResource(if (index == 0) R.drawable.bg_swiss_card else R.drawable.bg_swiss_input)
                setPadding(20, 16, 20, 16)
            }

            val pillView = TextView(this).apply {
                this.text = "● $pill"
                setTextColor(Color.parseColor("#F95700"))
                textSize = 9f
                setTypeface(Typeface.MONOSPACE, Typeface.BOLD)
            }

            val spokenTextView = TextView(this).apply {
                this.text = "\"$text\""
                setTextColor(if (index == 0) Color.parseColor("#111111") else Color.parseColor("#6B7280"))
                textSize = 13f
                setTypeface(null, if (index == 0) Typeface.BOLD else Typeface.NORMAL)
                setPadding(0, 4, 0, 0)
            }

            card.addView(pillView)
            card.addView(spokenTextView)

            lyricCards.add(card)
            lyricTexts.add(spokenTextView)

            layoutLyricsContainer.addView(card)
        }
    }

    private fun highlightLyric(index: Int) {
        for (i in lyricCards.indices) {
            if (i == index) {
                lyricCards[i].setBackgroundResource(R.drawable.bg_swiss_card)
                lyricTexts[i].setTextColor(Color.parseColor("#111111"))
                lyricTexts[i].setTypeface(null, Typeface.BOLD)
            } else {
                lyricCards[i].setBackgroundResource(R.drawable.bg_swiss_input)
                lyricTexts[i].setTextColor(Color.parseColor("#6B7280"))
                lyricTexts[i].setTypeface(null, Typeface.NORMAL)
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
            workoutService?.startWorkout(loadedManifestJson)
            applyCadenceSelection(spinnerCadence.selectedItemPosition)
            isWorkoutActive = true
            btnStart.text = "STOP WORKOUT [X]"
            btnStart.setBackgroundResource(R.drawable.bg_swiss_btn_red)
        }, 300)
    }

    private fun stopFullWorkout() {
        workoutService?.stopWorkout()
        if (isBound) {
            unbindService(serviceConnection)
            isBound = false
        }
        isWorkoutActive = false
        btnStart.text = "START RUN [GPS + AUDIO] →"
        btnStart.setBackgroundResource(R.drawable.bg_swiss_btn_black)
        highlightLyric(0)

        // Trigger instant Strava sync via GitHub API in background
        triggerInstantStravaSync()
    }

    private fun triggerInstantStravaSync() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val token = getSharedPreferences("tmm_prefs", Context.MODE_PRIVATE)
                    .getString("github_pat", null)
                
                if (!token.isNullOrEmpty()) {
                    val url = java.net.URL("https://api.github.com/repos/vish9731-agentic/TMM2027/actions/workflows/strava_scraper_sync.yml/dispatches")
                    val conn = url.openConnection() as java.net.HttpURLConnection
                    conn.requestMethod = "POST"
                    conn.setRequestProperty("Accept", "application/vnd.github+json")
                    conn.setRequestProperty("Authorization", "Bearer $token")
                    conn.setRequestProperty("X-GitHub-Api-Version", "2022-11-28")
                    conn.setRequestProperty("Content-Type", "application/json")
                    conn.doOutput = true
                    val body = "{\"ref\":\"main\"}"
                    conn.outputStream.write(body.toByteArray())
                    val code = conn.responseCode
                    withContext(Dispatchers.Main) {
                        if (code in 200..299) {
                            Toast.makeText(this@MainActivity, "⚡ Triggered Strava sync! Syncing to master plan...", Toast.LENGTH_SHORT).show()
                        }
                    }
                    conn.disconnect()
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        if (isBound) {
            unbindService(serviceConnection)
            isBound = false
        }
    }
}
