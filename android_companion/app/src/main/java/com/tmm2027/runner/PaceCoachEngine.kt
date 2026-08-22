package com.tmm2027.runner

import android.location.Location
import android.util.Log

/**
 * Real-Time Rolling GPS Pace Monitor & Anti-Nagging Dynamic Coach.
 * Compares current 20-second moving pace against target pace zone.
 */
class PaceCoachEngine(
    private val audioCueManager: AudioCueManager
) {
    private val recentSpeedSamples = mutableListOf<Float>()
    private var lastPaceAlertTimestamp = 0L
    private val alertCooldownMs = 60_000L // 60s cooldown to prevent nagging

    var minTargetPaceSecKm: Int = 440 // 7:20 min/km in seconds
    var maxTargetPaceSecKm: Int = 455 // 7:35 min/km in seconds

    fun setTargetPace(paceStr: String) {
        try {
            // e.g. "7:20 - 7:35 min/km" or "5:45 - 6:00 min/km"
            val parts = paceStr.split("-").map { it.replace("min/km", "").trim() }
            if (parts.isNotEmpty()) {
                val minP = parsePaceToSeconds(parts[0])
                val maxP = if (parts.size > 1) parsePaceToSeconds(parts[1]) else minP + 15
                minTargetPaceSecKm = minOf(minP, maxP)
                maxTargetPaceSecKm = maxOf(minP, maxP)
                Log.d("PaceCoachEngine", "Set target pace zone: $minTargetPaceSecKm to $maxTargetPaceSecKm sec/km")
            }
        } catch (e: Exception) {
            Log.w("PaceCoachEngine", "Could not parse pace: $paceStr")
        }
    }

    private fun parsePaceToSeconds(str: String): Int {
        val splits = str.trim().split(":")
        val mins = splits[0].toIntOrNull() ?: 7
        val secs = if (splits.size > 1) splits[1].toIntOrNull() ?: 20 else 0
        return mins * 60 + secs
    }

    fun onLocationUpdate(location: Location) {
        if (location.hasSpeed() && location.speed > 0.5f) {
            recentSpeedSamples.add(location.speed)
            if (recentSpeedSamples.size > 20) {
                recentSpeedSamples.removeAt(0)
            }

            checkPaceThresholds()
        }
    }

    private fun checkPaceThresholds() {
        val now = System.currentTimeMillis()
        if (now - lastPaceAlertTimestamp < alertCooldownMs) return
        if (recentSpeedSamples.size < 5) return

        // Calculate average speed in m/s
        val avgSpeed = recentSpeedSamples.average().toFloat()
        if (avgSpeed <= 0.8f) return // Below 3 km/h (walking/stopped)

        // Convert speed (m/s) to Pace (seconds per km)
        val currentPaceSecKm = (1000f / avgSpeed).toInt()
        val currentPaceFormatted = formatPace(currentPaceSecKm)

        // Tolerance buffer: +/- 15 sec/km
        val fastThreshold = minTargetPaceSecKm - 15
        val slowThreshold = maxTargetPaceSecKm + 15

        if (currentPaceSecKm < fastThreshold) {
            // Running too fast
            lastPaceAlertTimestamp = now
            val targetFormatted = formatPace(minTargetPaceSecKm)
            Log.d("PaceCoachEngine", "Pace Alert: Too Fast ($currentPaceFormatted vs target $targetFormatted)")
            audioCueManager.playDirectCue("Pace check: You are running $currentPaceFormatted. Ease off and slow down to $targetFormatted to save your energy.")
        } else if (currentPaceSecKm > slowThreshold) {
            // Running too slow
            lastPaceAlertTimestamp = now
            val targetFormatted = formatPace(maxTargetPaceSecKm)
            Log.d("PaceCoachEngine", "Pace Alert: Too Slow ($currentPaceFormatted vs target $targetFormatted)")
            audioCueManager.playDirectCue("Pace check: Running $currentPaceFormatted. Pick up your cadence to reach $targetFormatted.")
        }
    }

    fun getCurrentPaceFormatted(): String {
        if (recentSpeedSamples.isEmpty()) return "--:--"
        val avgSpeed = recentSpeedSamples.average().toFloat()
        if (avgSpeed <= 0.5f) return "--:--"
        val secKm = (1000f / avgSpeed).toInt()
        return formatPace(secKm)
    }

    private fun formatPace(secKm: Int): String {
        val m = secKm / 60
        val s = secKm % 60
        return String.format("%d:%02d min/km", m, s)
    }

    fun reset() {
        recentSpeedSamples.clear()
        lastPaceAlertTimestamp = 0L
    }
}
