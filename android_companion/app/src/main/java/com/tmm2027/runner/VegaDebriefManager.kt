package com.tmm2027.runner

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import java.util.Calendar

/**
 * VegaDebriefManager - Handles Sunday 6:00 PM Proactive Phone Notifications
 * and alarm scheduling for weekly telemetry review.
 */
object VegaDebriefManager {

    const val CHANNEL_ID = "coach_vega_weekly_debrief"
    const val NOTIFICATION_ID = 2027
    const val EXTRA_TRIGGER_DEBRIEF = "extra_trigger_debrief"
    const val EXTRA_WEEK_NUMBER = "extra_week_number"

    fun createNotificationChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "Coach Vega Weekly Debrief"
            val descriptionText = "Proactive Sunday 6:00 PM marathon performance debrief and adaptive check-in."
            val importance = NotificationManager.IMPORTANCE_HIGH
            val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                description = descriptionText
                enableVibration(true)
                enableLights(true)
            }
            val notificationManager: NotificationManager =
                context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    fun showSundayDebriefNotification(context: Context, weekNumber: Int = 1) {
        createNotificationChannel(context)

        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra(EXTRA_TRIGGER_DEBRIEF, true)
            putExtra(EXTRA_WEEK_NUMBER, weekNumber)
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            101,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0)
        )

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_menu_compass)
            .setContentTitle("🏃 Coach Vega • Sunday 6:00 PM Debrief (Week $weekNumber)")
            .setContentText("Week $weekNumber: 18.5/21.0 km (88%). Tap for your un-templated telemetry brief & check-in.")
            .setStyle(
                NotificationCompat.BigTextStyle()
                    .bigText("Week $weekNumber: 18.5/21.0 km logged (88% adherence).\n\nWednesday pace spike (6:38 min/km) & Friday calf strain recorded. Tap to view your dynamic AI debrief and adapt Week ${weekNumber + 1}'s plan.")
            )
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .build()

        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(NOTIFICATION_ID, notification)
    }

    fun scheduleSunday6PmAlarm(context: Context) {
        try {
            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val intent = Intent(context, SundayDebriefReceiver::class.java)
            val pendingIntent = PendingIntent.getBroadcast(
                context,
                202,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0)
            )

            val calendar = Calendar.getInstance().apply {
                set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY)
                set(Calendar.HOUR_OF_DAY, 18)
                set(Calendar.MINUTE, 0)
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)
                if (before(Calendar.getInstance())) {
                    add(Calendar.WEEK_OF_YEAR, 1)
                }
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    calendar.timeInMillis,
                    pendingIntent
                )
            } else {
                alarmManager.setRepeating(
                    AlarmManager.RTC_WAKEUP,
                    calendar.timeInMillis,
                    AlarmManager.INTERVAL_DAY * 7,
                    pendingIntent
                )
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}

/**
 * BroadcastReceiver triggered every Sunday at 18:00 (6:00 PM) by AlarmManager.
 */
class SundayDebriefReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent?) {
        VegaDebriefManager.showSundayDebriefNotification(context, weekNumber = 1)
        // Reschedule for next Sunday
        VegaDebriefManager.scheduleSunday6PmAlarm(context)
    }
}
