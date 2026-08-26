package com.tmm2027.runner

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.io.InputStreamReader
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

/**
 * PlanEngine - Athletic Training Plan & Dynamic Audio Manifest Strategy Engine.
 * 
 * Implements:
 * 1. Recovery Runs: 3 discrete stratified phases (Warmup -> Cruise [Majority] -> Cooldown).
 * 2. Speed / Intervals: Decomposed into granular, numbered sub-sections (Warmup -> Rep 1 -> Rest 1 -> Rep 2 -> Rest 2 ... -> Cooldown).
 * 3. Long Runs: Progressive endurance strategy with mandatory 45-min anti-cramp electrolyte alerts.
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
        var week_number: Int = 1
    )

    data class WeekPlan(
        val week_number: Int,
        val phase: String,
        val focus: String,
        val target_mileage_km: Double,
        val workouts: List<WorkoutDay>
    )

    data class TrainingSchedule(
        val weeks: List<WeekPlan>
    )

    fun getTodayOrTomorrowDate(isTomorrow: Boolean = false): String {
        val cal = Calendar.getInstance()
        if (isTomorrow) {
            cal.add(Calendar.DAY_OF_YEAR, 1)
        }
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        return sdf.format(cal.time)
    }

    fun getWeekWorkouts(context: Context, referenceDateStr: String): List<WorkoutDay> {
        val weekList = mutableListOf<WorkoutDay>()
        try {
            val assetManager = context.assets
            val inputStream = assetManager.open("training_data.json")
            val reader = InputStreamReader(inputStream)
            val schedule: TrainingSchedule = Gson().fromJson(reader, TrainingSchedule::class.java)
            reader.close()

            var targetWeek: WeekPlan? = null
            for (w in schedule.weeks) {
                for (d in w.workouts) {
                    if (d.date == referenceDateStr) {
                        targetWeek = w
                        break
                    }
                }
                if (targetWeek != null) break
            }

            if (targetWeek == null && schedule.weeks.isNotEmpty()) {
                targetWeek = schedule.weeks[0]
            }

            if (targetWeek != null) {
                for (w in targetWeek.workouts) {
                    w.week_number = targetWeek.week_number
                    weekList.add(w)
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
        val isInterval = wo.type.contains("Interval", ignoreCase = true) || 
                         wo.type.contains("Speed", ignoreCase = true) ||
                         wo.description.contains("x (", ignoreCase = true) ||
                         wo.description.contains("400m", ignoreCase = true)
        val isRecovery = wo.type.contains("Recovery", ignoreCase = true) || wo.type.contains("Easy", ignoreCase = true)
        val isLongRun = wo.type.contains("Long", ignoreCase = true)
        val isRest = wo.type.contains("Rest", ignoreCase = true) || (wo.distance_km == 0.0 && !wo.type.contains("Strength", ignoreCase = true))
        val isStrength = wo.type.contains("Strength", ignoreCase = true)

        val timeline = mutableListOf<Map<String, Any>>()

        if (isRest) {
            timeline.add(mapOf(
                "id" to "rest_briefing",
                "type" to "SESSION_START",
                "triggerType" to "TIME",
                "triggerSeconds" to 0,
                "title" to "Rest & Recovery Day",
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
                "title" to "Strength & Prehab Session",
                "text" to "Today is Strength Day. Focus on single-leg calf raises, eccentric heel drops, and core stability for lower back endurance.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))
        } else if (isInterval) {
            // =========================================================================
            // SPEED & INTERVALS: GRANULAR DISSECTED SUB-SECTIONS (Rep 1, Rest 1, Rep 2...)
            // =========================================================================
            timeline.add(mapOf(
                "id" to "start_run",
                "type" to "SESSION_START",
                "triggerType" to "TIME",
                "triggerSeconds" to 0,
                "title" to "Workout Started",
                "text" to "Starting Speed Intervals session. ${wo.description} Begin with your 1 km easy warmup jog.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            // 1. Warm-Up Sub-Section (10 mins / 1.0 km)
            timeline.add(mapOf(
                "id" to "warmup",
                "type" to "WARMUP",
                "triggerType" to "TIME",
                "triggerSeconds" to 3,
                "title" to "Phase 1: Warmup Jog (1.0 km)",
                "text" to "Phase 1: Warmup jog for 1.0 kilometer at 7:30 min/km, RPE 3. Gradually elevate heart rate.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            // Interval repetitions: default 4x 400m with 200m rest or 6x 1-min hard / 30s rest
            var currentSec = 600
            val totalReps = 4

            for (rep in 1..totalReps) {
                // Sub-Section: Interval Rep Pre-Cue (10s before)
                timeline.add(mapOf(
                    "id" to "precue_$rep",
                    "type" to "INTERVAL_PRE_CUE",
                    "triggerType" to "TIME",
                    "triggerSeconds" to currentSec - 10,
                    "title" to "Sub-Section: Rep $rep of $totalReps (Pre-Cue)",
                    "text" to "Get ready: Rep $rep of $totalReps. 400 meters hard effort at 5:50 min/km, RPE 8.",
                    "duckMusicSeconds" to 1.5,
                    "hasCountdown" to true,
                    "countdownStartSecond" to currentSec - 5
                ))

                // Sub-Section: Interval Rep START
                timeline.add(mapOf(
                    "id" to "start_$rep",
                    "type" to "INTERVAL_START",
                    "triggerType" to "TIME",
                    "triggerSeconds" to currentSec,
                    "title" to "400m Rep $rep @ 5:50 min/km",
                    "text" to "GO! Push to 5:50 min/km. Drive knees, keep cadence high at 175 steps per minute.",
                    "duckMusicSeconds" to 0.8,
                    "hasCountdown" to false
                ))

                currentSec += 140 // ~2 min 20s for 400m @ 5:50

                // Sub-Section: Rest Pre-Cue
                timeline.add(mapOf(
                    "id" to "rest_precue_$rep",
                    "type" to "REST_PRE_CUE",
                    "triggerType" to "TIME",
                    "triggerSeconds" to currentSec - 8,
                    "title" to "Rest $rep of $totalReps (Pre-Cue)",
                    "text" to "Rest in 5 seconds. 200 meters easy recovery jog.",
                    "duckMusicSeconds" to 1.5,
                    "hasCountdown" to true,
                    "countdownStartSecond" to currentSec - 5
                ))

                // Sub-Section: Rest START
                timeline.add(mapOf(
                    "id" to "rest_start_$rep",
                    "type" to "REST_START",
                    "triggerType" to "TIME",
                    "triggerSeconds" to currentSec,
                    "title" to "200m Recovery Jog $rep",
                    "text" to "Recover for 200 meters. Slow down, deep belly breaths, RPE 2.",
                    "duckMusicSeconds" to 1.0,
                    "hasCountdown" to false
                ))

                currentSec += 90 // 1.5 mins for 200m rest
            }

            // Cooldown Sub-Section
            timeline.add(mapOf(
                "id" to "cooldown",
                "type" to "COOLDOWN",
                "triggerType" to "TIME",
                "triggerSeconds" to currentSec,
                "title" to "Phase 3: Cooldown Jog (1.0 km)",
                "text" to "All intervals complete! Phase 3: 1.0 kilometer easy cooldown jog to flush lactic acid.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            // Completion
            timeline.add(mapOf(
                "id" to "complete",
                "type" to "SESSION_COMPLETE",
                "triggerType" to "TIME",
                "triggerSeconds" to currentSec + 450,
                "title" to "Interval Session Complete!",
                "text" to "Interval workout complete! Outstanding discipline. Take 500ml electrolyte water and complete your 10-minute lower body stretch.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

        } else if (isRecovery) {
            // =========================================================================
            // RECOVERY RUNS: 3 STRATIFIED PHASES (Warmup -> Cruise [70%] -> Cooldown)
            // =========================================================================
            val warmupKm = if (dist <= 4.0) 0.8 else 1.0
            val cooldownKm = if (dist <= 4.0) 0.8 else 1.0
            val cruiseKm = (dist - warmupKm - cooldownKm).coerceAtLeast(1.5)
            val cruiseEndKm = warmupKm + cruiseKm

            timeline.add(mapOf(
                "id" to "rec_start",
                "type" to "SESSION_START",
                "triggerType" to "TIME",
                "triggerSeconds" to 0,
                "title" to "Recovery Run Started",
                "text" to "Starting Recovery Run of ${wo.distance_km} km. Phase 1: ${warmupKm} km gentle warm-up at RPE 2.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            // Phase 1: Warmup
            timeline.add(mapOf(
                "id" to "rec_warmup",
                "type" to "WARMUP",
                "triggerType" to "TIME",
                "triggerSeconds" to 3,
                "title" to "Phase 1: Warmup (${warmupKm} km)",
                "text" to "Phase 1: Gentle warm-up. Ease your calves and joints into running motion. Target pace 8:00 to 8:15 min/km, RPE 2.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            // Phase 2: Main Cruise (Most Distance)
            timeline.add(mapOf(
                "id" to "rec_cruise_start",
                "type" to "CRUISE_START",
                "triggerType" to "DISTANCE",
                "triggerDistanceKm" to warmupKm,
                "title" to "Phase 2: Main Cruise (${String.format(Locale.US, "%.1f", cruiseKm)} km)",
                "text" to "Warm-up complete! Phase 2: Main Cruise for ${String.format(Locale.US, "%.1f", cruiseKm)} km. Lock into ${wo.target_pace}, cadence 168. Relax shoulders.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            // Cruise Midpoint split
            val midKm = warmupKm + (cruiseKm / 2.0)
            timeline.add(mapOf(
                "id" to "rec_cruise_mid",
                "type" to "DISTANCE_SPLIT",
                "triggerType" to "DISTANCE",
                "triggerDistanceKm" to midKm,
                "title" to "Cruise Midpoint (${String.format(Locale.US, "%.1f", midKm)} km)",
                "text" to "Cruise midpoint reached. Smooth aerobic rhythm. Breathe through nose and mouth comfortably.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            // Phase 3: Cooldown
            timeline.add(mapOf(
                "id" to "rec_cooldown_start",
                "type" to "COOLDOWN",
                "triggerType" to "DISTANCE",
                "triggerDistanceKm" to cruiseEndKm,
                "title" to "Phase 3: Cooldown (${cooldownKm} km)",
                "text" to "Cruise complete! Phase 3: ${cooldownKm} km easy cooldown. Gradually lower your effort to RPE 1 and ease down to walking pace.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            // Finish
            timeline.add(mapOf(
                "id" to "rec_complete",
                "type" to "SESSION_COMPLETE",
                "triggerType" to "DISTANCE",
                "triggerDistanceKm" to dist,
                "title" to "Recovery Run Complete!",
                "text" to "Recovery run complete! Great aerobic vascular flushing today. Begin your 10-minute calf armor release protocol.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

        } else if (isLongRun) {
            // =========================================================================
            // LONG RUNS: CONSERVATIVE FLOAT -> MARATHON CRUISE -> FUELING & FINISH
            // =========================================================================
            val warmupKm = 1.0
            timeline.add(mapOf(
                "id" to "long_start",
                "type" to "SESSION_START",
                "triggerType" to "TIME",
                "triggerSeconds" to 0,
                "title" to "Long Run Started",
                "text" to "Welcome to your ${wo.distance_km} km Long Run. Settle into a conservative float for the first kilometer at 7:45 min/km.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            // Phase 1: Conservative Float
            timeline.add(mapOf(
                "id" to "long_warmup",
                "type" to "WARMUP",
                "triggerType" to "DISTANCE",
                "triggerDistanceKm" to warmupKm,
                "title" to "1.0 KM • Settle Into Rhythm",
                "text" to "1 kilometer reached. Gently transition into your Marathon Cruise target pace: ${wo.target_pace}, RPE 3.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            // Distance splits
            val intDist = dist.toInt()
            for (km in 2..intDist) {
                if (km == (dist.toInt())) continue // covered by finish
                var extra = ""
                if (km == 3) extra = " Cruising steady. Keep your cadence high at 170 steps per minute."
                if (km == 5) extra = " 5k completed. Check posture: drop shoulders, relax neck."
                if (km == 10) extra = " 10k mark! Smooth aerodynamic rhythm."
                if (km == 15) extra = " 15k mark. Incline simulation: shorten stride, keep cadence fast."
                if (km == 20) extra = " 20k milestone! Strong mental stamina."

                timeline.add(mapOf(
                    "id" to "km_$km",
                    "type" to "DISTANCE_SPLIT",
                    "triggerType" to "DISTANCE",
                    "triggerDistanceKm" to km.toDouble(),
                    "title" to "Kilometer $km Split",
                    "text" to "Kilometer $km reached.$extra",
                    "duckMusicSeconds" to 1.5,
                    "hasCountdown" to false
                ))
            }

            // Compulsory 45-Min Anti-Cramp Salt Capsule Alert
            if (dist >= 6.0) {
                timeline.add(mapOf(
                    "id" to "fuel_45m",
                    "type" to "FUELING",
                    "triggerType" to "TIME",
                    "triggerSeconds" to 45 * 60,
                    "title" to "45:00 MIN • Anti-Cramp Salt",
                    "text" to "45 minutes elapsed. Take 1 Salt Capsule now with 150 ml water to protect your calves from cramping.",
                    "duckMusicSeconds" to 1.5,
                    "hasCountdown" to false
                ))
            }

            // 90-Min Gel Alert
            if (dist >= 12.0) {
                timeline.add(mapOf(
                    "id" to "fuel_90m",
                    "type" to "FUELING",
                    "triggerType" to "TIME",
                    "triggerSeconds" to 90 * 60,
                    "title" to "90:00 MIN • Energy Gel Alert",
                    "text" to "90 minutes completed. Take Gel number 2 with water. Maintain high cadence.",
                    "duckMusicSeconds" to 1.5,
                    "hasCountdown" to false
                ))
            }

            // Complete
            timeline.add(mapOf(
                "id" to "complete",
                "type" to "SESSION_COMPLETE",
                "triggerType" to "DISTANCE",
                "triggerDistanceKm" to dist,
                "title" to "Long Run Complete!",
                "text" to "Workout complete! Fantastic endurance today on your ${dist}km long run. Take 500ml electrolyte water and perform your 10-minute calf flush.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

        } else {
            // =========================================================================
            // AEROBIC BASE RUN: WARMUP -> AEROBIC CRUISE -> COOLDOWN
            // =========================================================================
            val warmupKm = 1.0
            val cooldownKm = 0.8
            val cruiseKm = (dist - warmupKm - cooldownKm).coerceAtLeast(1.0)
            val cruiseEndKm = warmupKm + cruiseKm

            timeline.add(mapOf(
                "id" to "aero_start",
                "type" to "SESSION_START",
                "triggerType" to "TIME",
                "triggerSeconds" to 0,
                "title" to "Aerobic Run Started",
                "text" to "Starting Aerobic Base Run of ${wo.distance_km} km. Phase 1: 1 km warmup at 7:35 min/km.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            timeline.add(mapOf(
                "id" to "aero_cruise",
                "type" to "CRUISE_START",
                "triggerType" to "DISTANCE",
                "triggerDistanceKm" to warmupKm,
                "title" to "Phase 2: Aerobic Cruise (${String.format(Locale.US, "%.1f", cruiseKm)} km)",
                "text" to "Warmup complete. Phase 2: Aerobic Cruise. Lock into ${wo.target_pace}, cadence 170 SPM.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            timeline.add(mapOf(
                "id" to "aero_cooldown",
                "type" to "COOLDOWN",
                "triggerType" to "DISTANCE",
                "triggerDistanceKm" to cruiseEndKm,
                "title" to "Phase 3: Cooldown (${cooldownKm} km)",
                "text" to "Cruise complete. Phase 3: ${cooldownKm} km easy cooldown jog. Ease your breathing.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            timeline.add(mapOf(
                "id" to "aero_complete",
                "type" to "SESSION_COMPLETE",
                "triggerType" to "DISTANCE",
                "triggerDistanceKm" to dist,
                "title" to "Aerobic Run Complete!",
                "text" to "Workout complete! Great aerobic base mileage today.",
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
