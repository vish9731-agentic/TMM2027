package com.tmm2027.runner

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioFocusRequest
import android.media.AudioManager
import android.media.ToneGenerator
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.util.Log
import java.util.Locale

/**
 * Manages Native Android Audio Focus (10% YouTube Music Ducking),
 * Zero-Latency 5-4-3-2-1 Countdown Beeps, and Voice Cues.
 */
class AudioCueManager(private val context: Context) : TextToSpeech.OnInitListener {

    private val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
    private var tts: TextToSpeech? = null
    private var isTtsReady = false
    private val handler = Handler(Looper.getMainLooper())

    private var audioFocusRequest: AudioFocusRequest? = null
    private var toneGen: ToneGenerator? = null

    init {
        tts = TextToSpeech(context, this)
        try {
            toneGen = ToneGenerator(AudioManager.STREAM_MUSIC, 100)
        } catch (e: Exception) {
            Log.e("AudioCueManager", "Failed to init ToneGenerator: ${e.message}")
        }
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts?.language = Locale.US
            tts?.setSpeechRate(1.05f)
            tts?.setPitch(1.0f)
            isTtsReady = true
            Log.d("AudioCueManager", "TTS Initialized successfully.")
        }
    }

    /**
     * Ducks YouTube Music down to 10% volume strictly 1.5s prior to cue.
     */
    fun requestDucking() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val audioAttributes = AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ASSISTANCE_NAVIGATION_GUIDANCE)
                .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                .build()

            audioFocusRequest = AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK)
                .setAudioAttributes(audioAttributes)
                .setAcceptsDelayedFocusGain(false)
                .setOnAudioFocusChangeListener { focusChange ->
                    Log.d("AudioCueManager", "Audio focus changed: $focusChange")
                }
                .build()

            audioFocusRequest?.let {
                val res = audioManager.requestAudioFocus(it)
                Log.d("AudioCueManager", "Requested Audio Ducking: Result=$res")
            }
        } else {
            @Suppress("DEPRECATION")
            audioManager.requestAudioFocus(
                null,
                AudioManager.STREAM_MUSIC,
                AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK
            )
        }
    }

    /**
     * Releases audio focus so YouTube Music immediately pops back to 100% volume.
     */
    fun releaseDucking() {
        handler.postDelayed({
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                audioFocusRequest?.let {
                    audioManager.abandonAudioFocusRequest(it)
                    Log.d("AudioCueManager", "Released Audio Focus -> Music restored to 100%")
                }
            } else {
                @Suppress("DEPRECATION")
                audioManager.abandonAudioFocus(null)
            }
        }, 500)
    }

    /**
     * Executes a complete Interval Transition:
     * 1. Duck YouTube Music (1.5s lead)
     * 2. Speak Prompt ("1 min hard, Pace 5:45, RPE 8")
     * 3. Beep Countdown 5... 4... 3... 2... 1... GO!
     * 4. Restore YouTube Music to 100%
     */
    fun playCueWithCountdown(promptText: String, onStartGo: () -> Unit) {
        requestDucking()

        handler.postDelayed({
            speakText(promptText) {
                // After voice finishes, start 5-4-3-2-1 countdown
                startCountdownSequence(onStartGo)
            }
        }, 500)
    }

    /**
     * Simple announcement (e.g. Fueling Alert, Split, Pace correction) with ducking.
     */
    fun playDirectCue(promptText: String) {
        requestDucking()
        handler.postDelayed({
            speakText(promptText) {
                releaseDucking()
            }
        }, 500)
    }

    private fun speakText(text: String, onComplete: () -> Unit) {
        if (!isTtsReady || tts == null) {
            onComplete()
            return
        }

        val utteranceId = "cue_${System.currentTimeMillis()}"
        tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
            override fun onStart(utteranceId: String?) {}
            override fun onDone(utteranceId: String?) {
                handler.post { onComplete() }
            }
            override fun onError(utteranceId: String?) {
                handler.post { onComplete() }
            }
        })

        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, utteranceId)
    }

    /**
     * 5-4-3-2-1 Countdown with tone beeps and "GO!" chime.
     */
    private fun startCountdownSequence(onStartGo: () -> Unit) {
        val countIntervalMs = 1000L

        for (i in 5 downTo 1) {
            val delay = (5 - i) * countIntervalMs
            handler.postDelayed({
                playBeep(ToneGenerator.TONE_PROP_BEEP, 120)
                Log.d("AudioCueManager", "Countdown: $i")
            }, delay)
        }

        // T = 0 (GO!)
        handler.postDelayed({
            playBeep(ToneGenerator.TONE_PROP_ACK, 350)
            speakText("GO!") {
                releaseDucking()
                onStartGo()
            }
        }, 5 * countIntervalMs)
    }

    fun playBeep(toneType: Int, durationMs: Int) {
        try {
            toneGen?.startTone(toneType, durationMs)
        } catch (e: Exception) {
            Log.e("AudioCueManager", "Tone error: ${e.message}")
        }
    }

    fun shutdown() {
        releaseDucking()
        tts?.stop()
        tts?.shutdown()
        toneGen?.release()
    }
}
