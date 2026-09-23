package com.tmm2027.runner

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioFocusRequest
import android.media.AudioManager
import android.media.MediaPlayer
import android.media.ToneGenerator
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File
import java.util.Locale

/**
 * Manages Native Android Audio Focus (10% YouTube Music Ducking),
 * Hybrid Voice Audio Playback (Gemini/ElevenLabs Studio Audio -> Native TTS Fallback),
 * Zero-Latency 5-4-3-2-1 Countdown Beeps, and Anti-Repetitive Dynamic Pace Alerts.
 */
class AudioCueManager(private val context: Context) : TextToSpeech.OnInitListener {

    private val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
    private var tts: TextToSpeech? = null
    private var isTtsReady = false
    private val handler = Handler(Looper.getMainLooper())

    private var audioFocusRequest: AudioFocusRequest? = null
    private var toneGen: ToneGenerator? = null
    private var mediaPlayer: MediaPlayer? = null

    data class QueuedItem(
        val text: String,
        val isCountdown: Boolean = false,
        var audioFilePath: String? = null,
        val isSunday: Boolean = false,
        val onStartGo: (() -> Unit)? = null,
        val onComplete: (() -> Unit)? = null
    )

    private val queue = java.util.ArrayDeque<QueuedItem>()
    private var isSpeaking = false

    enum class PaceAlertCategory { TOO_SLOW, TOO_FAST }

    private val defaultTooSlowPool = listOf(
        "Pace is dropping slightly. Relax your shoulders and pick up the cadence.",
        "A little behind target pace. Quicken the turnover, keep the foot strike light.",
        "Pace is slipping. Drive from the glutes, keep your posture upright and tall.",
        "We are below target pace. Find a steady rhythm and lift the tempo.",
        "Pace check: ease the cadence up a few beats per minute.",
        "Focus on your foot turnaround. Bring the pace smoothly back into the target zone.",
        "Slightly off the pace. Quick, light steps will get us right back on track."
    )

    private val defaultTooFastPool = listOf(
        "Pace is running hot. Protect tomorrow's workout and settle back into rhythm.",
        "Dial it back slightly. The discipline today is in staying patient and relaxed.",
        "A little fast right now. Drop the shoulders, shake out the hands, ease off.",
        "Ease back into the target zone. Save that extra gear for race day.",
        "You are ahead of the target zone. Float and relax into your aerobic rhythm.",
        "Running too fast for this session. Settle down, breathe through your diaphragm.",
        "Pace check: slow the cadence down a notch. Keep it strictly controlled."
    )

    private var lastSlowIndex = -1
    private var lastFastIndex = -1

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
            processNext()
        }
    }

    /**
     * Ducks YouTube Music down to 10% volume strictly prior to cue.
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
            if (!isSpeaking && queue.isEmpty()) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    audioFocusRequest?.let {
                        audioManager.abandonAudioFocusRequest(it)
                        Log.d("AudioCueManager", "Released Audio Focus -> Music restored to 100%")
                    }
                } else {
                    @Suppress("DEPRECATION")
                    audioManager.abandonAudioFocus(null)
                }
            }
        }, 400)
    }

    /**
     * Executes an Interval Transition:
     * 1. Duck YouTube Music
     * 2. Speak Prompt (via cached Studio Audio if available, else TTS)
     * 3. Beep Countdown 5... 4... 3... 2... 1... GO!
     * 4. Restore YouTube Music to 100%
     */
    fun playCueWithCountdown(promptText: String, audioFilePath: String? = null, isSunday: Boolean = false, onStartGo: () -> Unit) {
        queue.add(QueuedItem(
            text = promptText,
            isCountdown = true,
            audioFilePath = audioFilePath,
            isSunday = isSunday,
            onStartGo = onStartGo
        ))
        processNext()
    }

    /**
     * Direct announcement (Session Intro, Phase Warmup, Fueling Alert, Tactical Tip) with ducking.
     */
    fun playDirectCue(promptText: String, audioFilePath: String? = null, isSunday: Boolean = false, onComplete: (() -> Unit)? = null) {
        queue.add(QueuedItem(
            text = promptText,
            isCountdown = false,
            audioFilePath = audioFilePath,
            isSunday = isSunday,
            onComplete = onComplete
        ))
        processNext()
    }

    /**
     * Randomized anti-repetitive pace alerts. Never plays the same phrase twice consecutively.
     */
    fun playRandomPaceAlert(
        category: PaceAlertCategory,
        customPool: List<String>? = null,
        currentPaceFormatted: String? = null,
        targetPaceFormatted: String? = null
    ) {
        val pool = if (!customPool.isNullOrEmpty()) customPool else when (category) {
            PaceAlertCategory.TOO_SLOW -> defaultTooSlowPool
            PaceAlertCategory.TOO_FAST -> defaultTooFastPool
        }

        if (pool.isEmpty()) return

        val lastIdx = if (category == PaceAlertCategory.TOO_SLOW) lastSlowIndex else lastFastIndex
        var nextIdx: Int
        if (pool.size > 1) {
            do {
                nextIdx = (pool.indices).random()
            } while (nextIdx == lastIdx)
        } else {
            nextIdx = 0
        }

        if (category == PaceAlertCategory.TOO_SLOW) {
            lastSlowIndex = nextIdx
        } else {
            lastFastIndex = nextIdx
        }

        var text = pool[nextIdx]
        if (currentPaceFormatted != null && targetPaceFormatted != null && !text.contains(currentPaceFormatted)) {
            text = "Pace $currentPaceFormatted min per km. Target is $targetPaceFormatted. $text"
        }

        playDirectCue(text)
    }

    @Synchronized
    private fun processNext() {
        if (isSpeaking || queue.isEmpty()) return
        if (!isTtsReady && queue.peek()?.audioFilePath.isNullOrEmpty()) return

        val item = queue.poll() ?: return
        isSpeaking = true
        requestDucking()

        handler.postDelayed({
            if (!item.audioFilePath.isNullOrEmpty() && File(item.audioFilePath!!).exists()) {
                playViaMediaPlayer(item)
            } else {
                // Synthesize Studio HD audio via Gemini / ElevenLabs with caching
                CoroutineScope(Dispatchers.IO).launch {
                    val synthFile = try {
                        CloudVoiceSynthesizer.getOrSynthesizeAudio(context, item.text, item.isSunday)
                    } catch (e: Exception) {
                        Log.w("AudioCueManager", "CloudVoiceSynthesizer error: ${e.message}")
                        null
                    }
                    withContext(Dispatchers.Main) {
                        if (synthFile != null && synthFile.exists()) {
                            item.audioFilePath = synthFile.absolutePath
                            playViaMediaPlayer(item)
                        } else {
                            speakViaTts(item)
                        }
                    }
                }
            }
        }, 150)
    }

    private fun playViaMediaPlayer(item: QueuedItem) {
        try {
            mediaPlayer?.release()
            mediaPlayer = MediaPlayer().apply {
                setDataSource(item.audioFilePath)
                setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ASSISTANCE_NAVIGATION_GUIDANCE)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                        .build()
                )
                setOnCompletionListener {
                    it.release()
                    mediaPlayer = null
                    handler.post {
                        if (item.isCountdown) {
                            startCountdownSequence(item.onStartGo ?: {})
                        } else {
                            isSpeaking = false
                            item.onComplete?.invoke()
                            if (queue.isEmpty()) {
                                releaseDucking()
                            } else {
                                processNext()
                            }
                        }
                    }
                }
                setOnErrorListener { mp, what, extra ->
                    Log.w("AudioCueManager", "MediaPlayer playback error ($what, $extra), falling back to TTS")
                    mp.release()
                    mediaPlayer = null
                    speakViaTts(item)
                    true
                }
                prepare()
                start()
            }
        } catch (e: Exception) {
            Log.e("AudioCueManager", "MediaPlayer error: ${e.message}, falling back to TTS")
            speakViaTts(item)
        }
    }

    private fun speakViaTts(item: QueuedItem) {
        if (!isTtsReady) {
            isSpeaking = false
            releaseDucking()
            return
        }

        val utteranceId = "cue_${System.currentTimeMillis()}"
        tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
            override fun onStart(utteranceId: String?) {}
            override fun onDone(utteranceId: String?) {
                handler.post {
                    if (item.isCountdown) {
                        startCountdownSequence(item.onStartGo ?: {})
                    } else {
                        isSpeaking = false
                        item.onComplete?.invoke()
                        if (queue.isEmpty()) {
                            releaseDucking()
                        } else {
                            processNext()
                        }
                    }
                }
            }
            override fun onError(utteranceId: String?) {
                handler.post {
                    isSpeaking = false
                    item.onComplete?.invoke()
                    if (queue.isEmpty()) {
                        releaseDucking()
                    } else {
                        processNext()
                    }
                }
            }
        })

        tts?.speak(item.text, TextToSpeech.QUEUE_FLUSH, null, utteranceId)
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
            val utteranceId = "go_${System.currentTimeMillis()}"
            tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                override fun onStart(utteranceId: String?) {}
                override fun onDone(utteranceId: String?) {
                    handler.post {
                        isSpeaking = false
                        releaseDucking()
                        onStartGo()
                        processNext()
                    }
                }
                override fun onError(utteranceId: String?) {
                    handler.post {
                        isSpeaking = false
                        releaseDucking()
                        onStartGo()
                        processNext()
                    }
                }
            })
            tts?.speak("GO!", TextToSpeech.QUEUE_FLUSH, null, utteranceId)
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
        queue.clear()
        isSpeaking = false
        releaseDucking()
        mediaPlayer?.stop()
        mediaPlayer?.release()
        mediaPlayer = null
        tts?.stop()
        tts?.shutdown()
        toneGen?.release()
    }
}
