package com.tmm2027.runner

import android.media.ToneGenerator
import android.os.Handler
import android.os.Looper
import android.util.Log

/**
 * Subtle Cadence Metronome Generator (165–175 SPM).
 * Helps runners maintain optimal stride frequency to prevent calf and knee fatigue.
 */
class CadenceMetronome(private val audioCueManager: AudioCueManager) {

    private val handler = Handler(Looper.getMainLooper())
    private var isRunning = false
    var targetBpm: Int = 170

    private val tickRunnable = object : Runnable {
        override fun run() {
            if (!isRunning) return
            // Play a soft, brief high-frequency tick (30ms)
            audioCueManager.playBeep(ToneGenerator.TONE_PROP_BEEP2, 25)
            val intervalMs = (60_000L / targetBpm)
            handler.postDelayed(this, intervalMs)
        }
    }

    fun start(bpm: Int = 170) {
        if (isRunning) stop()
        targetBpm = bpm
        isRunning = true
        Log.d("CadenceMetronome", "Started Cadence Metronome at $targetBpm BPM")
        handler.post(tickRunnable)
    }

    fun stop() {
        isRunning = false
        handler.removeCallbacks(tickRunnable)
        Log.d("CadenceMetronome", "Stopped Cadence Metronome")
    }

    fun isRunning(): Boolean = isRunning
}
