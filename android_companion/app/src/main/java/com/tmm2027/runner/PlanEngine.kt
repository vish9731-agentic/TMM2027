package com.tmm2027.runner

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale
import java.util.TimeZone

/**
 * Dynamically computes and generates the exact audio coaching timeline
 * for ANY date directly on the athlete's phone.
 */
object PlanEngine {

    data class WorkoutDay(
        val day: String,
        val date: String,
        val type: String,
        val distance_km: Double,
        val target_pace: String,
        val rpe: Int,
        val description: String,
        val strength_prehab: String?,
        val fueling: String?,
        val week_number: Int = 1
    )

    fun getTodayOrTomorrowDate(isTomorrow: Boolean = false): String {
        val cal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"))
        if (isTomorrow) {
            cal.add(Calendar.DAY_OF_YEAR, 1)
        }
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        sdf.timeZone = TimeZone.getTimeZone("Asia/Kolkata")
        return sdf.format(cal.time)
    }

    fun getWeekWorkouts(context: Context, referenceDateStr: String): List<WorkoutDay> {
        val weekList = mutableListOf<WorkoutDay>()
        try {
            val json = context.assets.open("training_data.json").bufferedReader().use { it.readText() }
            val gson = Gson()
            val mapType = object : TypeToken<Map<String, Any>>() {}.type
            val root: Map<String, Any> = gson.fromJson(json, mapType)

            val weeks = root["weeks"] as? List<Map<String, Any>> ?: emptyList()
            var matchedWeek: Map<String, Any>? = null

            // 1. Find the week that contains referenceDateStr
            for (w in weeks) {
                val workouts = w["workouts"] as? List<Map<String, Any>> ?: emptyList()
                for (d in workouts) {
                    val dDate = d["date"] as? String
                    if (dDate == referenceDateStr) {
                        matchedWeek = w
                        break
                    }
                }
                if (matchedWeek != null) break
            }

            // Default to Week 1 or Week 2 if not matched
            if (matchedWeek == null && weeks.isNotEmpty()) {
                matchedWeek = weeks[0]
            }

            matchedWeek?.let { w ->
                val weekNum = (w["week_number"] as? Number)?.toInt() ?: 1
                val workouts = w["workouts"] as? List<Map<String, Any>> ?: emptyList()
                for (d in workouts) {
                    weekList.add(
                        WorkoutDay(
                            day = d["day"] as? String ?: "Running Day",
                            date = d["date"] as? String ?: "",
                            type = d["type"] as? String ?: "Aerobic Run",
                            distance_km = (d["distance_km"] as? Number)?.toDouble() ?: 0.0,
                            target_pace = d["target_pace"] as? String ?: "7:20 - 7:35 min/km",
                            rpe = (d["rpe"] as? Number)?.toInt() ?: 3,
                            description = d["description"] as? String ?: "Follow prescribed rhythm.",
                            strength_prehab = d["strength_prehab"] as? String,
                            fueling = d["fueling"] as? String,
                            week_number = weekNum
                        )
                    )
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        return weekList
    }

    fun getWorkoutForDate(context: Context, dateStr: String): WorkoutDay {
        val weekWorkouts = getWeekWorkouts(context, dateStr)
        for (w in weekWorkouts) {
            if (w.date == dateStr) return w
        }

        // Fallback default
        return WorkoutDay(
            day = "Sunday",
            date = dateStr,
            type = "Long Run",
            distance_km = 7.0,
            target_pace = "7:35 - 7:45 min/km",
            rpe = 3,
            description = "Week 1 long run. Focus on relaxed breathing, light foot strikes, and time on feet.",
            strength_prehab = "Post-run 10-min calf and quad flush",
            fueling = "Water sips every 2 km"
        )
    }

    fun buildManifestJson(wo: WorkoutDay): String {
        val dist = wo.distance_km
        val isInterval = wo.type.contains("Interval", ignoreCase = true) || wo.description.contains("x (", ignoreCase = true)
        val isRest = wo.type.contains("Rest", ignoreCase = true) || (wo.distance_km == 0.0 && !wo.type.contains("Strength", ignoreCase = true))
        val isStrength = wo.type.contains("Strength", ignoreCase = true)

        val timeline = mutableListOf<Map<String, Any>>()

        if (isRest) {
            timeline.add(mapOf(
                "id" to "rest_briefing",
                "type" to "SESSION_START",
                "triggerType" to "TIME",
                "triggerSeconds" to 0,
                "title" to "🧘 Rest & Recovery Day",
                "text" to "Today is a scheduled Rest Day. Hydrate with 2 to 2.5 liters of fluids, do light foam rolling, and allow muscle glycogen synthesis.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))
        } else if (isStrength) {
            timeline.add(mapOf(
                "id" to "strength_briefing",
                "type" to "SESSION_START",
                "triggerType" to "TIME",
                "triggerSeconds" to 0,
                "title" to "🏋️ Strength & Prehab Session",
                "text" to "Today is Strength Day. Focus on single-leg calf raises, eccentric heel drops, and core stability for lower back endurance.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))
        } else if (isInterval) {
            // Start Cue
            timeline.add(mapOf(
                "id" to "start_run",
                "type" to "SESSION_START",
                "triggerType" to "TIME",
                "triggerSeconds" to 0,
                "title" to "🚀 Workout Started",
                "text" to "Starting Speed Intervals workout. ${wo.description} Begin with a 10-minute easy jog warmup.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            // Warmup 10 mins (600s)
            var currentSec = 600
            timeline.add(mapOf(
                "id" to "warmup",
                "type" to "WARMUP",
                "triggerType" to "TIME",
                "triggerSeconds" to 5,
                "title" to "🏃 Warmup (10 Mins)",
                "text" to "Warmup: 10 minutes easy jog. RPE 3.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            for (rep in 1..6) {
                // Pre-cue (10s before)
                timeline.add(mapOf(
                    "id" to "precue_$rep",
                    "type" to "INTERVAL_PRE_CUE",
                    "triggerType" to "TIME",
                    "triggerSeconds" to currentSec - 10,
                    "title" to "🔥 Interval $rep of 6 (Pre-Cue)",
                    "text" to "Get ready: Interval $rep of 6. 1 minute hard effort. Target pace 5:45 min/km, RPE 8.",
                    "duckMusicSeconds" to 1.5,
                    "hasCountdown" to true,
                    "countdownStartSecond" to currentSec - 5
                ))

                // Start Effort
                timeline.add(mapOf(
                    "id" to "start_$rep",
                    "type" to "INTERVAL_START",
                    "triggerType" to "TIME",
                    "triggerSeconds" to currentSec,
                    "title" to "⚡ Interval $rep GO!",
                    "text" to "GO! Push to 5:45 min/km.",
                    "duckMusicSeconds" to 0.5,
                    "hasCountdown" to false
                ))

                currentSec += 60 // 1 min hard

                // Rest Pre-cue
                timeline.add(mapOf(
                    "id" to "rest_precue_$rep",
                    "type" to "REST_PRE_CUE",
                    "triggerType" to "TIME",
                    "triggerSeconds" to currentSec - 8,
                    "title" to "🧘 Recovery $rep (Pre-Cue)",
                    "text" to "Rest in 5 seconds. 30 seconds easy walk or slow jog.",
                    "duckMusicSeconds" to 1.5,
                    "hasCountdown" to true,
                    "countdownStartSecond" to currentSec - 5
                ))

                // Start Rest
                timeline.add(mapOf(
                    "id" to "rest_start_$rep",
                    "type" to "REST_START",
                    "triggerType" to "TIME",
                    "triggerSeconds" to currentSec,
                    "title" to "🧘 Rest $rep",
                    "text" to "Recover for 30 seconds. Catch your breath, RPE 2.",
                    "duckMusicSeconds" to 1.0,
                    "hasCountdown" to false
                ))

                currentSec += 30 // 30s rest
            }

            // Cooldown
            timeline.add(mapOf(
                "id" to "cooldown",
                "type" to "COOLDOWN",
                "triggerType" to "TIME",
                "triggerSeconds" to currentSec,
                "title" to "🧘 Cooldown",
                "text" to "Intervals complete! 10 minutes easy cooldown jog.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            timeline.add(mapOf(
                "id" to "complete",
                "type" to "SESSION_COMPLETE",
                "triggerType" to "TIME",
                "triggerSeconds" to currentSec + 600,
                "title" to "🏆 Interval Session Complete!",
                "text" to "Workout complete! Fantastic effort on today's intervals. Hydrate well with electrolytes.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

        } else {
            // Distance-based Run (Long Run, Recovery Run, Aerobic Base)
            timeline.add(mapOf(
                "id" to "start_run",
                "type" to "SESSION_START",
                "triggerType" to "TIME",
                "triggerSeconds" to 0,
                "title" to "🚀 Workout Started",
                "text" to "Starting ${wo.type} of ${wo.distance_km} kilometers. ${wo.description} Target pace is ${wo.target_pace}, RPE ${wo.rpe}. Settle into an easy rhythm.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            val intDist = dist.toInt()
            for (km in 1..intDist) {
                var extra = ""
                if (km == 1) extra = " Gently float into your rhythm. Do not start too fast."
                if (km == 3) extra = " Smooth aerobic cruising pace. Lock into your cadence."
                if (km == 5) extra = " 5k completed. Check your posture, relax your shoulders and breathe deeply."
                if (km == 10) extra = " 10k mark! Cadence steady and smooth."
                if (km == 15) extra = " 15k mark. Pedder Road incline simulation: shorten stride, keep cadence high."
                if (km == 20) extra = " 20k milestone! Strong mental discipline."

                timeline.add(mapOf(
                    "id" to "km_$km",
                    "type" to "DISTANCE_SPLIT",
                    "triggerType" to "DISTANCE",
                    "triggerDistanceKm" to km.toDouble(),
                    "title" to "📍 Kilometer $km Split",
                    "text" to "Kilometer $km reached.$extra",
                    "duckMusicSeconds" to 1.5,
                    "hasCountdown" to false
                ))
            }

            // Compulsory Fueling alerts
            if (dist >= 6.0) {
                timeline.add(mapOf(
                    "id" to "fuel_45m",
                    "type" to "FUELING",
                    "triggerType" to "TIME",
                    "triggerSeconds" to 45 * 60,
                    "title" to "💧 Anti-Cramp Salt Capsule (45m)",
                    "text" to "45 minutes elapsed. Take 1 Salt Capsule now with 150 ml water to protect your calves from cramping.",
                    "duckMusicSeconds" to 1.5,
                    "hasCountdown" to false
                ))
            }

            if (dist >= 12.0) {
                timeline.add(mapOf(
                    "id" to "fuel_90m",
                    "type" to "FUELING",
                    "triggerType" to "TIME",
                    "triggerSeconds" to 90 * 60,
                    "title" to "⚡ Energy Gel Alert (90m)",
                    "text" to "90 minutes completed. Take Gel number 2 with water. Keep your cadence high.",
                    "duckMusicSeconds" to 1.5,
                    "hasCountdown" to false
                ))
            }

            // Complete Cue
            timeline.add(mapOf(
                "id" to "complete",
                "type" to "SESSION_COMPLETE",
                "triggerType" to "DISTANCE_OR_TIME",
                "triggerDistanceKm" to dist,
                "triggerSeconds" to (dist * 460).toInt(),
                "title" to "🏆 Workout Complete!",
                "text" to "Workout complete! Fantastic work on today's ${dist}km session. Take 500ml electrolyte water and perform your ${wo.strength_prehab ?: "10-minute calf and quad flush"}.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))
        }

        val masterMap = mapOf(
            "workoutType" to wo.type,
            "distanceKm" to wo.distance_km,
            "targetPace" to wo.target_pace,
            "rpeTarget" to wo.rpe,
            "openingBriefing" to mapOf(
                "weatherAdvisory" to "Stay hydrated and stick to target pace."
            ),
            "timeline" to timeline
        )

        return Gson().toJson(masterMap)
    }
}
