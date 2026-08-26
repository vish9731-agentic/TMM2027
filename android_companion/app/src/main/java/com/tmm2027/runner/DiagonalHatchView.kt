package com.tmm2027.runner

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.util.AttributeSet
import android.view.View

/**
 * 45° Diagonal Industrial Hatching View.
 * Renders tactile high-contrast industrial safety stripes pattern over subtle rustic parchment.
 */
class DiagonalHatchView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    private val bgPaint = Paint().apply {
        color = Color.parseColor("#FAF8F3")
        style = Paint.Style.FILL
    }

    private val stripePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.parseColor("#111111")
        style = Paint.Style.STROKE
        strokeWidth = 3.5f * resources.displayMetrics.density
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        val w = width.toFloat()
        val h = height.toFloat()

        // 1. Fill rustic parchment background
        canvas.drawRect(0f, 0f, w, h, bgPaint)

        // 2. Draw -45 degree diagonal industrial stripes
        val density = resources.displayMetrics.density
        val step = 8.5f * density
        val strokeW = 3.5f * density
        stripePaint.strokeWidth = strokeW

        var d = -h
        val total = w + h
        while (d < total) {
            canvas.drawLine(d, 0f, d + h, h, stripePaint)
            d += step
        }
    }
}
