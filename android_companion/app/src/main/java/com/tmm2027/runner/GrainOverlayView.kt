package com.tmm2027.runner

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.util.AttributeSet
import android.view.View
import java.util.Random

/**
 * High-performance dynamic 35mm film grain overlay.
 * Renders tactile silver-halide noise over both dark backgrounds and white bento boxes at 24 FPS.
 */
class GrainOverlayView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    private val paint = Paint().apply {
        isAntiAlias = false
        isFilterBitmap = false
        alpha = 24 // Refined tactile 35mm film grain on clean white & subtle rustic parchment
    }

    private var noiseBitmap: Bitmap? = null
    private val random = Random()
    private val grainWidth = 256
    private val grainHeight = 256

    private val fps = 24L
    private val frameIntervalMs = 1000L / fps

    private val animatorRunnable = object : Runnable {
        override fun run() {
            generateNoise()
            invalidate()
            postDelayed(this, frameIntervalMs)
        }
    }

    init {
        setWillNotDraw(false)
        generateNoise()
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        post(animatorRunnable)
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        removeCallbacks(animatorRunnable)
    }

    private fun generateNoise() {
        if (noiseBitmap == null) {
            noiseBitmap = Bitmap.createBitmap(grainWidth, grainHeight, Bitmap.Config.ARGB_8888)
        }

        val pixels = IntArray(grainWidth * grainHeight)
        for (i in pixels.indices) {
            val v = random.nextInt(256)
            // Monochromatic tactile grain particles
            val particleAlpha = random.nextInt(90)
            pixels[i] = Color.argb(particleAlpha, v, v, v)
        }
        noiseBitmap?.setPixels(pixels, 0, grainWidth, 0, 0, grainWidth, grainHeight)
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        val bmp = noiseBitmap ?: return

        val w = width.toFloat()
        val h = height.toFloat()

        var x = 0f
        while (x < w) {
            var y = 0f
            while (y < h) {
                canvas.drawBitmap(bmp, x, y, paint)
                y += grainHeight
            }
            x += grainWidth
        }
    }
}
