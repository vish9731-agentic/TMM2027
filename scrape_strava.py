#!/usr/bin/env python3
"""
==============================================================================
ZERO-API STRAVA SCRAPER & SUPABASE SYNCHRONIZER
==============================================================================
Pulls recent runs from Strava using web session authentication, computes
metric-by-metric variance against planned workouts, and updates Supabase.
"""

import os
import sys
import json
import re
import math
from datetime import datetime, timezone
import urllib.request
import urllib.parse
import urllib.error

# Environment Variables
STRAVA_COOKIE = os.environ.get("STRAVA_SESSION_COOKIE", "").strip()
SUPABASE_URL = os.environ.get("SUPABASE_URL", "").strip().rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "").strip()

def parse_pace_to_seconds(pace_str):
    """Converts pace string like '7:20 min/km' or '7:20/km' to total seconds per km."""
    if not pace_str or pace_str == "N/A":
        return 0
    m = re.search(r"(\d+):(\d+)", pace_str)
    if m:
        return int(m.group(1)) * 60 + int(m.group(2))
    return 0

def parse_target_pace_range(pace_str):
    """Extracts min and max seconds per km from a target pace range string."""
    if not pace_str or pace_str == "N/A":
        return None
    matches = re.findall(r"(\d+):(\d+)", pace_str)
    if len(matches) >= 2:
        p1 = int(matches[0][0]) * 60 + int(matches[0][1])
        p2 = int(matches[1][0]) * 60 + int(matches[1][1])
        return {"min_sec": min(p1, p2), "max_sec": max(p1, p2)}
    elif len(matches) == 1:
        p = int(matches[0][0]) * 60 + int(matches[0][1])
        return {"min_sec": p - 10, "max_sec": p + 10}
    return None

def calculate_variance(planned_dist, actual_dist, target_pace, actual_pace_str):
    """Calculates Distance Delta, Pace Delta, and Overall Precision Score (%)."""
    dist_delta = round(actual_dist - planned_dist, 2)
    dist_err_pct = (abs(dist_delta) / planned_dist) * 100 if planned_dist > 0 else 0

    pace_delta_sec = 0
    pace_err_pct = 0

    actual_pace_secs = parse_pace_to_seconds(actual_pace_str)
    target_range = parse_target_pace_range(target_pace)

    if actual_pace_secs > 0 and target_range:
        if actual_pace_secs < target_range["min_sec"]:
            # Faster than fastest target pace
            pace_delta_sec = actual_pace_secs - target_range["min_sec"]
            pace_err_pct = (abs(pace_delta_sec) / target_range["min_sec"]) * 100
        elif actual_pace_secs > target_range["max_sec"]:
            # Slower than slowest target pace
            pace_delta_sec = actual_pace_secs - target_range["max_sec"]
            pace_err_pct = (pace_delta_sec / target_range["max_sec"]) * 100
        else:
            pace_delta_sec = 0
            pace_err_pct = 0

    score_pct = max(0, min(100, round(100 - (dist_err_pct * 0.6 + pace_err_pct * 0.4))))
    return dist_delta, pace_delta_sec, score_pct

def fetch_strava_activities():
    """Fetches recent activities using the web session cookie."""
    if not STRAVA_COOKIE:
        print("⚠️ Warning: STRAVA_SESSION_COOKIE is missing.")
        return []

    cookie_header = STRAVA_COOKIE
    if not cookie_header.startswith("_strava4_session="):
        cookie_header = f"_strava4_session={cookie_header}"

    url = "https://www.strava.com/athlete/training_activities?page=1&per_page=15"
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest",
        "Cookie": cookie_header,
        "Referer": "https://www.strava.com/athlete/training"
    }

    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=20) as response:
            content = response.read().decode("utf-8")
            data = json.loads(content)
            
            # Strava returns { "models": [...] }
            activities = data.get("models", [])
            print(f"✅ Successfully retrieved {len(activities)} activities from Strava web feed.")
            return activities
    except urllib.error.HTTPError as e:
        print(f"❌ Strava HTTP Error: {e.code} {e.reason}")
        if e.code in (401, 403, 302):
            print("💡 Your Strava session cookie may have expired. Please re-copy _strava4_session from browser.")
        return []
    except Exception as e:
        print(f"❌ Error scraping Strava: {e}")
        return []

def query_supabase_workout(date_str):
    """Queries planned workout for a specific date from Supabase."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        return None

    url = f"{SUPABASE_URL}/rest/v1/daily_workouts?workout_date=eq.{date_str}&select=*"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Accept": "application/json"
    }

    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            res = json.loads(response.read().decode("utf-8"))
            if res and len(res) > 0:
                return res[0]
    except Exception as e:
        print(f"⚠️ Error querying Supabase for date {date_str}: {e}")
    return None

def update_supabase_workout(date_str, payload):
    """Updates a workout row in Supabase daily_workouts table."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("⚠️ Supabase credentials missing. Skipping cloud write.")
        return False

    url = f"{SUPABASE_URL}/rest/v1/daily_workouts?workout_date=eq.{date_str}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="PATCH")
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            res = json.loads(response.read().decode("utf-8"))
            return bool(res)
    except Exception as e:
        print(f"❌ Failed to update Supabase for date {date_str}: {e}")
        return False

def main():
    print("==================================================")
    print("🏃 Starting Strava -> Supabase Workout Sync...")
    print(f"⏰ Execution Time: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}")
    print("==================================================")

    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Error: SUPABASE_URL or SUPABASE_KEY is not set.")
        sys.exit(1)

    activities = fetch_strava_activities()
    if not activities:
        print("ℹ️ No activities found or authentication failed. Exiting gracefully.")
        return

    synced_count = 0

    for act in activities:
        # Filter for runs
        act_type = act.get("type", "") or act.get("activity_type", "")
        if str(act_type).lower() != "run":
            continue

        # Extract date (YYYY-MM-DD)
        start_date_raw = act.get("start_date_local_raw") or act.get("start_date") or act.get("start_time", "")
        date_match = re.search(r"(\d{4}-\d{2}-\d{2})", str(start_date_raw))
        if not date_match:
            continue
        date_str = date_match.group(1)

        # Extract distance in km
        dist_raw = act.get("distance_raw") or act.get("distance", 0)
        try:
            dist_km = round(float(dist_raw) / 1000.0, 2) if float(dist_raw) > 100 else round(float(dist_raw), 2)
        except (ValueError, TypeError):
            continue

        if dist_km <= 0:
            continue

        # Extract moving time in seconds
        time_raw = act.get("moving_time_raw") or act.get("elapsed_time_raw") or act.get("moving_time", 0)
        try:
            duration_secs = int(time_raw)
        except (ValueError, TypeError):
            duration_secs = 0

        # Calculate pace
        if duration_secs > 0 and dist_km > 0:
            pace_secs_per_km = duration_secs / dist_km
            p_min = math.floor(pace_secs_per_km / 60)
            p_sec = round(pace_secs_per_km % 60)
            pace_str = f"{p_min}:{p_sec:02d} min/km"
        else:
            pace_str = "N/A"

        # Query planned workout from Supabase
        planned_wo = query_supabase_workout(date_str)
        planned_dist = float(planned_wo.get("distance_km", dist_km)) if planned_wo else dist_km
        target_pace = planned_wo.get("target_pace", "N/A") if planned_wo else "N/A"

        # Calculate variance
        dist_delta, pace_delta_sec, score_pct = calculate_variance(planned_dist, dist_km, target_pace, pace_str)

        print(f"\n📊 Synced Run: {date_str} • {act.get('name', 'Run')}")
        print(f"   • Actual: {dist_km} km @ {pace_str}")
        print(f"   • Planned: {planned_dist} km @ {target_pace}")
        print(f"   • Variance: {dist_delta:+} km | Pace Delta: {pace_delta_sec:+}s/km")
        print(f"   • Accuracy Score: {score_pct}%")

        # Update Supabase
        payload = {
            "is_completed": True,
            "actual_distance_km": dist_km,
            "actual_pace": pace_str,
            "actual_duration_min": round(duration_secs / 60, 2),
            "distance_variance_km": dist_delta,
            "pace_variance_sec": pace_delta_sec,
            "compliance_score_pct": score_pct,
            "ingestion_source": "strava_github_action",
            "athlete_notes": f"Auto-synced from Strava ({act.get('name', 'Run')})"
        }

        success = update_supabase_workout(date_str, payload)
        if success:
            print(f"   ✅ Supabase daily_workouts row updated for {date_str}!")
            synced_count += 1
        else:
            print(f"   ⚠️ Could not update row in Supabase.")

    print(f"\n🏁 Finished! {synced_count} run(s) synced to Supabase successfully.")

if __name__ == "__main__":
    main()
