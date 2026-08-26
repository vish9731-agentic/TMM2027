package com.tmm2027.runner

import android.location.Location
import android.util.Log

/**
 * High-Precision Rolling GPS Pace Engine & Smart Auto-Cadence Governor.
 *
 * Implements Strava/NRC grade distance-delta smoothing with accuracy filtering
 * and outlier rejection to eliminate the "consistently slow" pocket-lag artifact.
 */
class PaceCoachEngine(
    private val audioCueManager: AudioCueManager
) {
    var cadenceMetronome: CadenceMetronome? = null

    // Target Pace Zone (in seconds per km)
    var minTargetPaceSecKm: Int = 440 // 7:20 min/km default
    var maxTargetPaceSecKm: Int = 455 // 7:35 min/km default

    private var lastValidLocation: Location? = null
    private val recentSpeedEstimates = mutableListOf<Float>() // m/s
    private var lastAlertTimestamp = 0L
    private val alertCooldownMs = 60_000L // 60s anti-nagging cooldown

    private var paceFormattedString: String = "--:--"
    var currentSmoothedSpeedMs: Float = 0.0f
        private set
    var gpsAccuracyMeters: Float = 0.0f
        private set

    fun setTargetPace(paceStr: String) {
        try {
            // e.g. "7:35 - 7:45 min/km" or "5:45 - 6:00 min/km"
            val parts = paceStr.split("-").map { it.replace("min/km", "").trim() }
            if (parts.isNotEmpty()) {
                val minP = parsePaceToSeconds(parts[0])
                val maxP = if (parts.size > 1) parsePaceToSeconds(parts[1]) else minP + 15
                minTargetPaceSecKm = minOf(minP, maxP)
                maxTargetPaceSecKm = maxOf(minP, maxP)
                Log.d("PaceCoachEngine", "Set target pace zone: $minTargetPaceSecKm - $maxTargetPaceSecKm sec/km ($paceStr)")
            }
        } catch (e: Exception) {
            Log.w("PaceCoachEngine", "Could not parse target pace: $paceStr")
        }
    }

    private fun parsePaceToSeconds(str: String): Int {
        val splits = str.trim().split(":")
        val mins = splits[0].toIntOrNull() ?: 7
        val secs = if (splits.size > 1) splits[1].toIntOrNull() ?: 20 else 0
        return mins * 60 + secs
    }

    /**
     * High-precision location processor matching Strava / NRC smoothing.
     */
    fun onLocationUpdate(location: Location) {
        gpsAccuracyMeters = location.accuracy

        // 1. Discard low-accuracy fixes (> 14m) to prevent erratic pace spikes
        if (location.hasAccuracy() && location.accuracy > 14.0f) {
            Log.d("PaceCoachEngine", "Skipping low accuracy fix: ±${location.accuracy}m")
            return
        }

        var calculatedSpeedMs = 0f

        // 2. High-Precision Distance-Delta Speed Calculation
        if (lastValidLocation != null) {
            val deltaDistM = lastValidLocation!!.distanceTo(location)
            val deltaTimeS = (location.time - lastValidLocation!!.time) / 1000.0f

            if (deltaTimeS in 0.5f..5.0f && deltaDistM > 0.3f) {
                val computedSpeed = deltaDistM / deltaTimeS
                // Cap realistic human running speed (max 8.5 m/s = 2:00 min/km)
                if (computedSpeed in 0.5f..8.5f) {
                    calculatedSpeedMs = computedSpeed
                }
            }
        }

        // 3. Fallback to hardware Doppler speed if delta-time is fresh and valid
        if (calculatedSpeedMs <= 0.5f && location.hasSpeed() && location.speed > 0.5f) {
            calculatedSpeedMs = location.speed
        }

        lastValidLocation = location

        if (calculatedSpeedMs > 0.5f) {
            recentSpeedEstimates.add(calculatedSpeedMs)
            // Maintain 15-second rolling sliding window
            if (recentSpeedEstimates.size > 15) {
                recentSpeedEstimates.removeAt(0)
            }

            // Exponential Weighted Moving Average (EWMA) with median smoothing
            val sorted = recentSpeedEstimates.sorted()
            val medianSpeed = sorted[sorted.size / 2]
            
            // 70% weight on median, 30% on latest speed
            currentSmoothedSpeedMs = (medianSpeed * 0.70f) + (calculatedSpeedMs * 0.30f)

            val paceSecKm = (1000.0f / currentSmoothedSpeedMs).toInt()
            val mins = paceSecKm / 60
            val secs = paceSecKm % 60
            paceFormattedString = String.format("%d:%02d", mins, secs)

            checkPaceAndAutoGovernCadence(paceSecKm)
        }
    }

    private fun checkPaceAndAutoGovernCadence(currentPaceSecKm: Int) {
        val now = System.currentTimeMillis()
        if (now - lastAlertTimestamp < alertCooldownMs) return
        if (recentSpeedEstimates.size < 6) return // Wait for 6s steady samples

        val targetMid = (minTargetPaceSecKm + maxTargetPaceSecKm) / 2
        val delta = currentPaceSecKm - targetMid

        // Running Too Slow (15+ seconds slower than max target zone)
        if (currentPaceSecKm > maxTargetPaceSecKm + 15) {
            lastAlertTimestamp = now
            val currentFormatted = paceFormattedString
            val targetFormatted = String.format("%d:%02d", maxTargetPaceSecKm / 60, maxTargetPaceSecKm % 60)

            // Auto-Cadence Adjustment: +3 SPM to pick up step rate
            val newBpm = cadenceMetronome?.adjustCadenceForPace(+3)

            if (newBpm != null && cadenceMetronome?.currentMode == CadenceMetronome.Mode.AUTO_PACE_SYNC) {
                audioCueManager.playDirectCue(
                    "Pace is $currentFormatted, target is $targetFormatted. Picking up cadence to $newBpm steps per minute to hit target pace."
                )
            } else {
                audioCueManager.playDirectCue(
                    "Pace is $currentFormatted min per km. Target is $targetFormatted. Pick up the cadence slightly."
                )
            }
        }
        // Running Too Fast (15+ seconds faster than min target zone on easy/long runs)
        else if (currentPaceSecKm < minTargetPaceSecKm - 15) {
            lastAlertTimestamp = now
            val currentFormatted = paceFormattedString
            val targetFormatted = String.format("%d:%02d", minTargetPaceSecKm / 60, minTargetPaceSecKm % 60)

            // Auto-Cadence Adjustment: -3 SPM to relax step rate
            val newBpm = cadenceMetronome?.adjustCadenceForPace(-3)

            if (newBpm != null && cadenceMetronome?.currentMode == CadenceMetronome.Mode.AUTO_PACE_SYNC) {
                audioCueManager.playDirectCue(
                    "Pacing fast at $currentFormatted min per km. Easing cadence to $newBpm steps per minute. Relax your stride."
                )
            } else {
                audioCueManager.playDirectCue(
                    "Pace is $currentFormatted min per km. Target is $targetFormatted. Settle back into an easy rhythm."
                )
            }
        }
    }

    fun getCurrentPaceFormatted(): String = paceFormattedString
}
