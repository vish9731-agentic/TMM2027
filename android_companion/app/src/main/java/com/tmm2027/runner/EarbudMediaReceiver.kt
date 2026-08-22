package com.tmm2027.runner

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import android.view.KeyEvent

/**
 * Intercepts Earbud & Headset Hardware Button Taps:
 * - Double Click: Re-plays the last interval cue / target pace
 * - Triple Click: Skips current rest period or moves to next interval
 */
class EarbudMediaReceiver : BroadcastReceiver() {

    companion object {
        private var lastClickTime = 0L
        private var clickCount = 0
        private val handler = android.os.Handler(android.os.Looper.getMainLooper())
        var listener: EarbudButtonListener? = null

        interface EarbudButtonListener {
            fun onDoubleTap()
            fun onTripleTap()
        }
    }

    override fun onReceive(context: Context?, intent: Intent?) {
        if (Intent.ACTION_MEDIA_BUTTON == intent?.action) {
            val event = intent.getParcelableExtra<KeyEvent>(Intent.EXTRA_KEY_EVENT)
            if (event?.action == KeyEvent.ACTION_DOWN) {
                val now = System.currentTimeMillis()
                if (now - lastClickTime < 450) {
                    clickCount++
                } else {
                    clickCount = 1
                }
                lastClickTime = now

                handler.removeCallbacksAndMessages(null)
                handler.postDelayed({
                    when (clickCount) {
                        2 -> {
                            Log.d("EarbudMediaReceiver", "Double Tap Detected -> Repeat Cue")
                            listener?.onDoubleTap()
                        }
                        3 -> {
                            Log.d("EarbudMediaReceiver", "Triple Tap Detected -> Skip Interval")
                            listener?.onTripleTap()
                        }
                    }
                    clickCount = 0
                }, 500)
            }
        }
    }
}
