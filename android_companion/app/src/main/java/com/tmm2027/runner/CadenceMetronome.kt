package com.tmm2027.runner

import android.media.ToneGenerator
import android.os.Handler
import android.os.Looper
import android.util.Log

/**
 * High-Performance Cadence Metronome Generator (158–184 SPM).
 * Supports both fixed BPM selection and live Auto-Pace Sync Governor
 * where step frequency automatically adjusts to keep the athlete on target pace.
 */
class CadenceMetronome(private val audioCueManager: AudioCueManager) {

    enum class Mode {
        OFF,
        FIXED_BPM,
        AUTO_PACE_SYNC
    }

    private val handler = Handler(Looper.getMainLooper())
    private var isRunning = false

    var currentMode: Mode = Mode.OFF
    var targetBpm: Int = 170
        private set

    var onCadenceChanged: ((Int, Mode) -> Unit)? = null

    private val tickRunnable = object : Runnable {
        override fun run() {
            if (!isRunning) return
            // Soft high-frequency subtle tick (25ms duration)
            audioCueManager.playBeep(ToneGenerator.TONE_PROP_BEEP2, 22)
            val intervalMs = (60_000L / targetBpm)
            handler.postDelayed(this, intervalMs)
        }
    }

    fun startFixed(bpm: Int) {
        stop()
        targetBpm = bpm.coerceIn(150, 190)
        currentMode = Mode.FIXED_BPM
        isRunning = true
        Log.d("CadenceMetronome", "Started Fixed Cadence Metronome at $targetBpm BPM")
        onCadenceChanged?.invoke(targetBpm, currentMode)
        handler.post(tickRunnable)
    }

    fun startAutoPaceSync(baseBpm: Int = 170) {
        stop()
        targetBpm = baseBpm.coerceIn(160, 180)
        currentMode = Mode.AUTO_PACE_SYNC
        isRunning = true
        Log.d("CadenceMetronome", "Started Auto-Pace Sync Cadence at $targetBpm BPM")
        onCadenceChanged?.invoke(targetBpm, currentMode)
        handler.post(tickRunnable)
    }

    /**
     * Dynamically adjusts cadence in Auto-Pace Sync mode to pull the runner into target pace.
     */
    fun adjustCadenceForPace(deltaBpm: Int): Int {
        if (currentMode != Mode.AUTO_PACE_SYNC || !isRunning) return targetBpm

        val oldBpm = targetBpm
        targetBpm = (targetBpm + deltaBpm).coerceIn(158, 184)

        if (oldBpm != targetBpm) {
            Log.d("CadenceMetronome", "Auto-Pace Governor adjusted cadence: $oldBpm -> $targetBpm BPM (delta $deltaBpm)")
            onCadenceChanged?.invoke(targetBpm, currentMode)
        }
        return targetBpm
    }

    fun stop() {
        isRunning = false
        currentMode = Mode.OFF
        handler.removeCallbacks(tickRunnable)
        Log.d("CadenceMetronome", "Stopped Cadence Metronome")
        onCadenceChanged?.invoke(targetBpm, currentMode)
    }

    fun isRunning(): Boolean = isRunning
}
