package com.tmm2027.runner

import android.content.Context
import android.graphics.*
import android.util.AttributeSet
import android.view.View

/**
 * Anodized Brushed Conical Metallic Steel Badge View.
 * Renders a radial conical gradient reflection with structural border and WK indicator pill.
 */
class ConicalSteelBadgeView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    private var weekText = "WK 01"

    private val pillPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.parseColor("#F2EFE6")
        style = Paint.Style.FILL
    }

    private val pillStrokePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.parseColor("#111111")
        style = Paint.Style.STROKE
        strokeWidth = 1.5f * resources.displayMetrics.density
    }

    private val textPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.parseColor("#111111")
        typeface = Typeface.create(Typeface.MONOSPACE, Typeface.BOLD)
        textAlign = Paint.Align.CENTER
    }

    private val dividerPaint = Paint().apply {
        color = Color.parseColor("#111111")
        style = Paint.Style.STROKE
        strokeWidth = 2.5f * resources.displayMetrics.density
    }

    fun setWeekText(text: String) {
        weekText = text
        invalidate()
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        val w = width.toFloat()
        val h = height.toFloat()
        if (w <= 0 || h <= 0) return

        val cx = w / 2f
        val cy = h / 2f
        val density = resources.displayMetrics.density

        // 1. Conical Metallic Reflection Gradient (SweepGradient)
        val colors = intArrayOf(
            Color.parseColor("#E4E4E8"),
            Color.parseColor("#B8B8C0"),
            Color.parseColor("#FAFAFC"),
            Color.parseColor("#9E9EA8"),
            Color.parseColor("#E4E4E8"),
            Color.parseColor("#B0B0B8"),
            Color.parseColor("#E4E4E8")
        )
        val positions = floatArrayOf(0f, 0.17f, 0.33f, 0.50f, 0.67f, 0.83f, 1f)
        val sweep = SweepGradient(cx, cy, colors, positions)
        val metalPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { shader = sweep }

        canvas.drawRect(0f, 0f, w, h, metalPaint)

        // 2. Left 2.5dp black structural divider
        val strokeW = 2.5f * density
        dividerPaint.strokeWidth = strokeW
        canvas.drawLine(strokeW / 2f, 0f, strokeW / 2f, h, dividerPaint)

        // 3. Central WK Pill Badge
        val pillW = 50f * density
        val pillH = 24f * density
        val pillRect = RectF(cx - pillW / 2f, cy - pillH / 2f, cx + pillW / 2f, cy + pillH / 2f)
        val corner = 6f * density

        canvas.drawRoundRect(pillRect, corner, corner, pillPaint)
        canvas.drawRoundRect(pillRect, corner, corner, pillStrokePaint)

        // 4. Monospaced Text inside Pill
        textPaint.textSize = 10.5f * density
        val textY = cy - ((textPaint.descent() + textPaint.ascent()) / 2)
        canvas.drawText(weekText, cx, textY, textPaint)
    }
}
