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
        val hasHillsAndTempo = wo.description.contains("hill", ignoreCase = true) && wo.description.contains("tempo", ignoreCase = true)
        val hasContinuous = !hasHillsAndTempo && (
            wo.description.contains("continuous", ignoreCase = true) || 
            (wo.type.contains("Tempo", ignoreCase = true) && !Regex("[0-9]+\\s*[x×X]\\s*").containsMatchIn(wo.description)) ||
            (wo.type.contains("Threshold", ignoreCase = true) && !Regex("[0-9]+\\s*[x×X]\\s*").containsMatchIn(wo.description))
        )

        val isRepetition = !hasHillsAndTempo && !hasContinuous && (
            wo.type.contains("Interval", ignoreCase = true) || 
            wo.type.contains("Stride", ignoreCase = true) ||
            wo.description.contains("stride", ignoreCase = true) ||
            wo.description.contains("400m", ignoreCase = true) ||
            wo.description.contains("100m", ignoreCase = true) ||
            Regex("[0-9]+\\s*[x×X]\\s*").containsMatchIn(wo.description)
        )
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
        } else if (hasHillsAndTempo) {
            // =========================================================================
            // HYBRID: HILLS + CONTINUOUS TEMPO BLOCK
            // =========================================================================
            var warmupKm = 2.0
            val warmupMatch = Regex("([\\d\\.]+)\\s*km\\s*warmup", RegexOption.IGNORE_CASE).find(wo.description)
            if (warmupMatch != null) warmupKm = warmupMatch.groupValues[1].toDoubleOrNull() ?: 2.0

            timeline.add(mapOf(
                "id" to "start_run",
                "type" to "SESSION_START",
                "triggerType" to "TIME",
                "triggerSeconds" to 0,
                "title" to "Hills + Tempo Started",
                "text" to "Starting Hybrid session: 4 Hill Repeats followed by a 2 km Tempo Block. Begin with your ${warmupKm} km easy warmup float.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            // 1. Warmup
            timeline.add(mapOf(
                "id" to "warmup",
                "type" to "WARMUP",
                "triggerType" to "TIME",
                "triggerSeconds" to 3,
                "title" to "Phase 1: Warmup Float (${warmupKm} km)",
                "text" to "Phase 1: Warmup float for ${warmupKm} km at 7:45 min/km, RPE 3. Dynamic mobility for ankles and Achilles.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            var currentSec = (warmupKm * 465).toInt()
            val totalHillReps = 4

            for (rep in 1..totalHillReps) {
                // Hill Pre-Cue
                timeline.add(mapOf(
                    "id" to "hill_precue_$rep",
                    "type" to "INTERVAL_PRE_CUE",
                    "triggerType" to "TIME",
                    "triggerSeconds" to currentSec - 10,
                    "title" to "Hill Repeat $rep of $totalHillReps (Pre-Cue)",
                    "text" to "Get ready: 75-second Uphill Repeat $rep of $totalHillReps. Drive glutes and knees, RPE 8.",
                    "duckMusicSeconds" to 1.5,
                    "hasCountdown" to true,
                    "countdownStartSecond" to currentSec - 5
                ))

                // Hill Start
                timeline.add(mapOf(
                    "id" to "hill_start_$rep",
                    "type" to "INTERVAL_START",
                    "triggerType" to "TIME",
                    "triggerSeconds" to currentSec,
                    "title" to "75s Uphill Repeat $rep (RPE 8)",
                    "text" to "ATTACK THE HILL! Drive your knees, keep chest proud and tall, push at RPE 8.",
                    "duckMusicSeconds" to 0.8,
                    "hasCountdown" to false
                ))

                currentSec += 75

                // Rest Pre-Cue
                timeline.add(mapOf(
                    "id" to "hill_rest_precue_$rep",
                    "type" to "REST_PRE_CUE",
                    "triggerType" to "TIME",
                    "triggerSeconds" to currentSec - 8,
                    "title" to "Jog-Down Rest $rep of $totalHillReps",
                    "text" to "Rest in 5 seconds. Easy jog-down recovery to hill base.",
                    "duckMusicSeconds" to 1.5,
                    "hasCountdown" to true,
                    "countdownStartSecond" to currentSec - 5
                ))

                // Rest Start
                timeline.add(mapOf(
                    "id" to "hill_rest_start_$rep",
                    "type" to "REST_START",
                    "triggerType" to "TIME",
                    "triggerSeconds" to currentSec,
                    "title" to "Jog-Down Rest $rep",
                    "text" to "Easy jog down to the base. Shake out arms and reset your breathing, RPE 2.",
                    "duckMusicSeconds" to 1.0,
                    "hasCountdown" to false
                ))

                currentSec += 90
            }

            // Phase 2: Tempo Block
            timeline.add(mapOf(
                "id" to "hybrid_tempo_start",
                "type" to "CRUISE_START",
                "triggerType" to "TIME",
                "triggerSeconds" to currentSec,
                "title" to "Phase 2: Continuous Tempo Block (2.0 km)",
                "text" to "Hills complete! Now immediately transition into Phase 2: 2.0 km continuous Tempo at 6:30 min/km. Lock into 172 steps per minute.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            currentSec += (2.0 * 390).toInt() // ~13 mins for 2km @ 6:30

            // Phase 3: Cooldown
            timeline.add(mapOf(
                "id" to "cooldown",
                "type" to "COOLDOWN",
                "triggerType" to "TIME",
                "triggerSeconds" to currentSec,
                "title" to "Phase 3: Cooldown Flush (1.5 km)",
                "text" to "Tempo block finished! Phase 3: 1.5 km gentle cooldown flush jog to clear lactate.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            // Completion
            timeline.add(mapOf(
                "id" to "complete",
                "type" to "SESSION_COMPLETE",
                "triggerType" to "TIME",
                "triggerSeconds" to currentSec + 720,
                "title" to "Hybrid Session Complete!",
                "text" to "Hybrid Hills and Tempo session complete! Sensational mental grit today. Drink 500ml electrolyte water and complete your full calf armor routine.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

        } else if (hasContinuous) {
            // =========================================================================
            // CONTINUOUS SUSTAINED TEMPO / THRESHOLD BLOCK
            // =========================================================================
            var warmupKm = 1.5
            var cooldownKm = 1.5
            val warmupMatch = Regex("([\\d\\.]+)\\s*km\\s*(?:warmup|warm-up|easy)", RegexOption.IGNORE_CASE).find(wo.description)
            val cooldownMatch = Regex("([\\d\\.]+)\\s*km\\s*(?:cooldown|cool-down|flush|easy)", RegexOption.IGNORE_CASE).find(wo.description)
            if (warmupMatch != null) warmupKm = warmupMatch.groupValues[1].toDoubleOrNull() ?: 1.5
            if (cooldownMatch != null) cooldownKm = cooldownMatch.groupValues[1].toDoubleOrNull() ?: 1.5

            val tempoDistMatch = Regex("([\\d\\.]+)\\s*km\\s*(?:continuous|@\\s*tempo|tempo|@\\s*mp)", RegexOption.IGNORE_CASE).find(wo.description)
            val tempoKm = tempoDistMatch?.groupValues?.get(1)?.toDoubleOrNull() ?: (dist - warmupKm - cooldownKm).coerceAtLeast(1.0)
            val tempoEndKm = warmupKm + tempoKm

            val tempoPaceMatch = Regex("\\(([0-9]:[0-9]{2}(?:\\s*-\\s*[0-9]:[0-9]{2})?\\s*min/km)\\)", RegexOption.IGNORE_CASE).find(wo.description)
            val tempoPaceStr = tempoPaceMatch?.groupValues?.get(1) ?: wo.target_pace

            timeline.add(mapOf(
                "id" to "start_run",
                "type" to "SESSION_START",
                "triggerType" to "TIME",
                "triggerSeconds" to 0,
                "title" to "Continuous Tempo Started",
                "text" to "Starting Continuous Tempo session: ${wo.type}. ${wo.description} Begin with your ${warmupKm} km easy warmup float.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            // 1. Warmup
            timeline.add(mapOf(
                "id" to "warmup",
                "type" to "WARMUP",
                "triggerType" to "TIME",
                "triggerSeconds" to 3,
                "title" to "Phase 1: Warmup Float (${warmupKm} km)",
                "text" to "Phase 1: Warmup float for ${warmupKm} km at 7:45 min/km, RPE 3. Loosen up hips, ankles, and Achilles.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            // 2. Continuous Tempo Block
            timeline.add(mapOf(
                "id" to "tempo_start",
                "type" to "CRUISE_START",
                "triggerType" to "DISTANCE",
                "triggerDistanceKm" to warmupKm,
                "title" to "Phase 2: Continuous Tempo (${tempoKm} km)",
                "text" to "Warmup complete! Lock into Continuous Tempo: ${tempoKm} km at $tempoPaceStr. 172 steps per minute, 2:2 breathing pattern, RPE 7.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            // 3. Cooldown Flush
            timeline.add(mapOf(
                "id" to "cooldown",
                "type" to "COOLDOWN",
                "triggerType" to "DISTANCE",
                "triggerDistanceKm" to tempoEndKm,
                "title" to "Phase 3: Cooldown Flush (${cooldownKm} km)",
                "text" to "Tempo block finished! Phase 3: ${cooldownKm} km easy cooldown flush jog and walking transition to clear lactate.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            // 4. Complete
            timeline.add(mapOf(
                "id" to "complete",
                "type" to "SESSION_COMPLETE",
                "triggerType" to "DISTANCE",
                "triggerDistanceKm" to dist,
                "title" to "Tempo Session Complete!",
                "text" to "Tempo session complete! Outstanding lactate threshold discipline. Take 500ml electrolyte water and complete your 10-minute calf and quad stretches.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

        } else if (isRepetition) {
            // =========================================================================
            // SPEED, STRIDES & INTERVALS: GRANULAR DISSECTED SUB-SECTIONS
            // =========================================================================
            var warmupKm = 1.0
            var cooldownKm = 1.0
            if (wo.distance_km >= 5.0) {
                warmupKm = 1.5
                cooldownKm = 2.0
            }

            val warmupSec = (warmupKm * 465).toInt()

            timeline.add(mapOf(
                "id" to "start_run",
                "type" to "SESSION_START",
                "triggerType" to "TIME",
                "triggerSeconds" to 0,
                "title" to "Workout Started",
                "text" to "Starting Speed session: ${wo.type}. ${wo.description} Begin with your ${warmupKm} km easy warmup float.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            // 1. Warm-Up Sub-Section
            timeline.add(mapOf(
                "id" to "warmup",
                "type" to "WARMUP",
                "triggerType" to "TIME",
                "triggerSeconds" to 3,
                "title" to "Phase 1: Warmup Jog (${warmupKm} km)",
                "text" to "Phase 1: Warmup float for ${warmupKm} km at 7:45 min/km, RPE 3. Loosen up hips, ankles, and Achilles.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            // Parse rep parameters
            var totalReps = 4
            var repLabel = "Interval"
            var repPace = "5:50 min/km"
            var restType = "Recovery Jog"
            var repDurationSec = 140
            var restDurationSec = 90

            val strideMatch = Regex("(\\d+)\\s*[x×X]\\s*(\\d+m|\\d+sec|\\d+s|\\d+min|\\d+km|[0-9\\-]+s)\\s*([a-zA-Z\\s\\-]+)").find(wo.description)
            if (strideMatch != null) {
                totalReps = strideMatch.groupValues[1].toIntOrNull() ?: 4
                val unit = strideMatch.groupValues[2].trim()
                val name = strideMatch.groupValues[3].trim()
                val isStride = name.contains("stride", ignoreCase = true) || wo.type.contains("stride", ignoreCase = true)
                repLabel = "$unit ${if (isStride) "Stride" else "Rep"}"

                if (isStride) {
                    repPace = "5:30 min/km"
                    repDurationSec = 25
                    restDurationSec = 90
                    restType = "Walk Rest"
                }
            } else {
                val matchX = Regex("(\\d+)\\s*[x×X]\\s*").find(wo.description)
                if (matchX != null) {
                    totalReps = matchX.groupValues[1].toIntOrNull() ?: 4
                }
            }

            var currentSec = warmupSec

            for (rep in 1..totalReps) {
                // Sub-Section: Interval Rep Pre-Cue (10s before)
                timeline.add(mapOf(
                    "id" to "precue_$rep",
                    "type" to "INTERVAL_PRE_CUE",
                    "triggerType" to "TIME",
                    "triggerSeconds" to currentSec - 10,
                    "title" to "Rep $rep of $totalReps (Pre-Cue)",
                    "text" to "Get ready: $repLabel $rep of $totalReps. Accelerate to $repPace.",
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
                    "title" to "$repLabel $rep @ $repPace",
                    "text" to "GO! Push to $repPace. Fast relaxed effort, tall posture, light foot strikes.",
                    "duckMusicSeconds" to 0.8,
                    "hasCountdown" to false
                ))

                currentSec += repDurationSec

                // Sub-Section: Rest Pre-Cue
                timeline.add(mapOf(
                    "id" to "rest_precue_$rep",
                    "type" to "REST_PRE_CUE",
                    "triggerType" to "TIME",
                    "triggerSeconds" to currentSec - 8,
                    "title" to "Rest $rep of $totalReps (Pre-Cue)",
                    "text" to "Rest in 5 seconds. $restDurationSec seconds $restType.",
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
                    "title" to "$restDurationSec s $restType $rep",
                    "text" to "Recover for $restDurationSec seconds. Full recovery, deep belly breaths, lower heart rate, RPE 2.",
                    "duckMusicSeconds" to 1.0,
                    "hasCountdown" to false
                ))

                currentSec += restDurationSec
            }

            // Cooldown Sub-Section
            timeline.add(mapOf(
                "id" to "cooldown",
                "type" to "COOLDOWN",
                "triggerType" to "TIME",
                "triggerSeconds" to currentSec,
                "title" to "Phase 3: Cooldown Flush (${cooldownKm} km)",
                "text" to "All reps complete! Phase 3: ${cooldownKm} km easy cooldown jog to flush lactic acid.",
                "duckMusicSeconds" to 1.5,
                "hasCountdown" to false
            ))

            // Completion
            timeline.add(mapOf(
                "id" to "complete",
                "type" to "SESSION_COMPLETE",
                "triggerType" to "TIME",
                "triggerSeconds" to currentSec + (cooldownKm * 480).toInt(),
                "title" to "Session Complete!",
                "text" to "Speed workout complete! Outstanding discipline today. Take 500ml electrolyte water and complete your 10-minute hamstring and calf stretches.",
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
