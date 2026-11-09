#!/usr/bin/env python3
"""
==============================================================================
ZERO-API STRAVA SCRAPER & SUPABASE SYNCHRONIZER (ULTRA-ROBUST & RESILIENT)
==============================================================================
Pulls recent runs from Strava using web session authentication, computes
metric-by-metric variance against planned workouts, and updates Supabase.
"""

import os
import sys
import json
import re
import math
from datetime import datetime, timezone, timedelta
import urllib.request
import urllib.parse
import urllib.error

# Environment Variables
STRAVA_COOKIE = os.environ.get("STRAVA_SESSION_COOKIE", "").strip()
SUPABASE_URL = os.environ.get("SUPABASE_URL", "").strip().rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "").strip()

# IST Timezone (UTC+5:30) - Primary athlete tracking timezone
IST_TZ = timezone(timedelta(hours=5, minutes=30))

_cached_db_columns = None

def get_supabase_workout_columns():
    """Detects available columns in the Supabase daily_workouts table to avoid schema errors."""
    global _cached_db_columns
    if _cached_db_columns is not None:
        return _cached_db_columns
    if not SUPABASE_URL or not SUPABASE_KEY:
        return set()
    url = f"{SUPABASE_URL}/rest/v1/daily_workouts?limit=1"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Accept": "application/json"
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if data and isinstance(data, list) and len(data) > 0:
                _cached_db_columns = set(data[0].keys())
                return _cached_db_columns
    except Exception as e:
        print(f"⚠️ Could not detect Supabase schema columns: {e}")
    _cached_db_columns = {"id", "week_number", "day_of_week", "workout_date", "distance_km", "target_pace", "is_completed", "actual_distance_km", "actual_pace", "athlete_notes"}
    return _cached_db_columns

def parse_pace_to_seconds(pace_str):
    if not pace_str or pace_str == "N/A":
        return 0
    m = re.search(r"(\d+):(\d+)", pace_str)
    if m:
        return int(m.group(1)) * 60 + int(m.group(2))
    return 0

def parse_target_pace_range(pace_str):
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
    dist_delta = round(actual_dist - planned_dist, 2)
    dist_err_pct = (abs(dist_delta) / planned_dist) * 100 if planned_dist > 0 else 0

    pace_delta_sec = 0
    pace_err_pct = 0

    actual_pace_secs = parse_pace_to_seconds(actual_pace_str)
    target_range = parse_target_pace_range(target_pace)

    if actual_pace_secs > 0 and target_range:
        if actual_pace_secs < target_range["min_sec"]:
            pace_delta_sec = actual_pace_secs - target_range["min_sec"]
            pace_err_pct = (abs(pace_delta_sec) / target_range["min_sec"]) * 100
        elif actual_pace_secs > target_range["max_sec"]:
            pace_delta_sec = actual_pace_secs - target_range["max_sec"]
            pace_err_pct = (pace_delta_sec / target_range["max_sec"]) * 100
        else:
            pace_delta_sec = 0
            pace_err_pct = 0

    score_pct = max(0, min(100, round(100 - (dist_err_pct * 0.6 + pace_err_pct * 0.4))))
    return dist_delta, pace_delta_sec, score_pct

def extract_date_str(act):
    """Robustly extracts YYYY-MM-DD from various possible Strava date fields with IST awareness."""
    # 1. Prefer explicit local date fields (already in athlete's timezone)
    for field in ["start_date_local", "start_date_local_raw", "start_day", "start_time"]:
        val = act.get(field)
        if not val:
            continue
        m = re.search(r"(\d{4}-\d{2}-\d{2})", str(val))
        if m:
            return m.group(1)
        if isinstance(val, (int, float)) and val > 1000000000:
            ts = val / 1000.0 if val > 1000000000000 else val
            return datetime.fromtimestamp(ts, IST_TZ).strftime("%Y-%m-%d")
        try:
            parsed = datetime.strptime(str(val)[:20], "%b %d, %Y")
            return parsed.strftime("%Y-%m-%d")
        except Exception:
            pass

    # 2. Check UTC start_date converted to IST (+05:30)
    for field in ["start_date"]:
        val = act.get(field)
        if not val:
            continue
        if isinstance(val, (int, float)) and val > 1000000000:
            ts = val / 1000.0 if val > 1000000000000 else val
            return datetime.fromtimestamp(ts, IST_TZ).strftime("%Y-%m-%d")
        iso_str = str(val).strip()
        if "T" in iso_str and (iso_str.endswith("Z") or "+" in iso_str):
            try:
                clean_iso = iso_str.replace("Z", "+00:00")
                dt = datetime.fromisoformat(clean_iso)
                return dt.astimezone(IST_TZ).strftime("%Y-%m-%d")
            except Exception:
                pass
        m = re.search(r"(\d{4}-\d{2}-\d{2})", iso_str)
        if m:
            return m.group(1)
    return None

def parse_distance_km(act):
    for key in ["distance_raw", "distance", "total_distance", "stat_distance"]:
        val = act.get(key)
        if val is None or val == "":
            continue
        if isinstance(val, (int, float)):
            num = float(val)
            return round(num / 1000.0, 2) if num > 100 else round(num, 2)
        s = str(val).replace(",", "").strip()
        m = re.search(r"(\d+(?:\.\d+)?)", s)
        if m:
            num = float(m.group(1))
            if "m" in s.lower() and "k" not in s.lower():
                return round(num / 1000.0, 2) if num > 100 else round(num, 2)
            if num > 100:
                return round(num / 1000.0, 2)
            return round(num, 2)
    return 0.0

def parse_duration_seconds(act):
    for key in ["moving_time_raw", "moving_time", "elapsed_time_raw", "elapsed_time", "time_raw", "time"]:
        val = act.get(key)
        if val is None or val == "":
            continue
        if isinstance(val, (int, float)):
            return int(val)
        s = str(val).strip()
        if ":" in s:
            parts = [int(p) for p in re.findall(r"\d+", s)]
            if len(parts) == 3:
                return parts[0] * 3600 + parts[1] * 60 + parts[2]
            elif len(parts) == 2:
                return parts[0] * 60 + parts[1]
        hours = re.search(r"(\d+)\s*h", s, re.IGNORECASE)
        mins = re.search(r"(\d+)\s*m", s, re.IGNORECASE)
        secs = re.search(r"(\d+)\s*s", s, re.IGNORECASE)
        if hours or mins or secs:
            total = 0
            if hours: total += int(hours.group(1)) * 3600
            if mins: total += int(mins.group(1)) * 60
            if secs: total += int(secs.group(1))
            return total
        nums = re.findall(r"\d+", s)
        if len(nums) == 1:
            try:
                return int(nums[0])
            except ValueError:
                pass
    return 0

def fetch_strava_activities():
    if not STRAVA_COOKIE:
        print("⚠️ Warning: STRAVA_SESSION_COOKIE is missing.")
        return []

    cookie_header = STRAVA_COOKIE
    if not cookie_header.startswith("_strava4_session="):
        cookie_header = f"_strava4_session={cookie_header}"

    url = "https://www.strava.com/athlete/training_activities?page=1&per_page=30"
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
            activities = data.get("models", [])
            print(f"✅ Successfully retrieved {len(activities)} activities from Strava web feed.")
            return activities
    except urllib.error.HTTPError as e:
        print(f"❌ Strava HTTP Error: {e.code} {e.reason}")
        return []
    except Exception as e:
        print(f"❌ Error scraping Strava: {e}")
        return []

def query_supabase_workout(date_str):
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

    # Only include keys that actually exist in the DB schema cache to prevent PGRST204 errors
    available_cols = get_supabase_workout_columns()
    clean_payload = {k: v for k, v in payload.items() if not available_cols or k in available_cols}
    if not clean_payload:
        clean_payload = {
            "is_completed": True,
            "actual_distance_km": payload.get("actual_distance_km"),
            "actual_pace": payload.get("actual_pace"),
            "athlete_notes": payload.get("athlete_notes")
        }

    data = json.dumps(clean_payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="PATCH")
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            res = json.loads(response.read().decode("utf-8"))
            return bool(res)
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8")
        print(f"⚠️ Payload write warning ({e.code}): {err_msg}")
        # Core fallback
        core_payload = {
            "is_completed": payload.get("is_completed", True),
            "actual_distance_km": payload.get("actual_distance_km"),
            "actual_pace": payload.get("actual_pace"),
            "athlete_notes": payload.get("athlete_notes")
        }
        data_fb = json.dumps(core_payload).encode("utf-8")
        req_fb = urllib.request.Request(url, data=data_fb, headers=headers, method="PATCH")
        try:
            with urllib.request.urlopen(req_fb, timeout=15) as fb_resp:
                res = json.loads(fb_resp.read().decode("utf-8"))
                return bool(res)
        except Exception as fb_err:
            print(f"❌ Fallback update failed: {fb_err}")
            return False
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
        print("ℹ️ No activities found or authentication failed.")
        return

    # Pre-fetch Supabase columns
    available_cols = get_supabase_workout_columns()
    print(f"📋 Detected Supabase daily_workouts columns: {len(available_cols)} available")

    # Group runs by date_str (resilient multi-activity & deduplication engine)
    activities_by_date = {}
    print("\n🔍 Inspecting Discovered Strava Activities:")
    for idx, act in enumerate(activities):
        name = act.get("name", "Untitled")
        act_type = str(act.get("type") or act.get("activity_type") or act.get("display_type") or "").strip()
        date_str = extract_date_str(act) or "Unknown Date"
        dist_km = parse_distance_km(act)
        duration_secs = parse_duration_seconds(act)

        # Calculate Pace
        if duration_secs > 0 and dist_km > 0:
            pace_secs = duration_secs / dist_km
            p_m = math.floor(pace_secs / 60)
            p_s = round(pace_secs % 60)
            pace_str = f"{p_m}:{p_s:02d} min/km"
        else:
            pace_str = "N/A"

        print(f"[{idx+1}] \"{name}\" • Type: {act_type} • Date: {date_str} • Distance: {dist_km} km • Pace: {pace_str}")

        is_run = any(t in act_type.lower() for t in ["run", "jog", "treadmill"]) or act_type == "" or "run" in name.lower() or "vdhm" in name.lower() or "shakeout" in name.lower()
        if not is_run or dist_km <= 0 or date_str == "Unknown Date":
            continue

        item = {
            "name": name,
            "type": act_type or "Run",
            "date_str": date_str,
            "dist_km": dist_km,
            "duration_secs": duration_secs,
            "pace_str": pace_str
        }
        activities_by_date.setdefault(date_str, []).append(item)

    synced_count = 0

    # Process each day with intelligent multi-run / crash resolution
    for date_str, runs in activities_by_date.items():
        planned_wo = query_supabase_workout(date_str)
        if not planned_wo:
            print(f"   ℹ️ Date {date_str} is outside the 22-week plan dates in Supabase.")
            continue

        planned_dist = float(planned_wo.get("distance_km", 0))
        target_pace = planned_wo.get("target_pace", "N/A")

        # Pick the best run or combine them
        # If one run is an exact / close match to planned distance, prioritize it over an aborted/crashed run
        if len(runs) > 1:
            # Sort runs: prefer the run closest to planned distance, or longest run
            runs.sort(key=lambda r: (abs(r["dist_km"] - planned_dist) if planned_dist > 0 else -r["dist_km"]))
            primary_run = runs[0]
            dist_km = primary_run["dist_km"]
            duration_secs = primary_run["duration_secs"]
            pace_str = primary_run["pace_str"]
            name = primary_run["name"]
            extra_count = len(runs) - 1
            notes_str = f"Auto-synced from Strava ({name})"
            if extra_count > 0:
                other_names = ", ".join(r["name"] for r in runs[1:])
                notes_str += f" [Note: {extra_count} other activity on date: {other_names}]"
        else:
            primary_run = runs[0]
            dist_km = primary_run["dist_km"]
            duration_secs = primary_run["duration_secs"]
            pace_str = primary_run["pace_str"]
            name = primary_run["name"]
            notes_str = f"Auto-synced from Strava ({name})"

        dist_delta, pace_delta_sec, score_pct = calculate_variance(planned_dist, dist_km, target_pace, pace_str)

        print(f"\n   🎯 MATCHED SCHEDULED WORKOUT: Week {planned_wo.get('week_number')} {planned_wo.get('day_of_week')} ({date_str})")
        print(f"      • Planned: {planned_dist} km @ {target_pace} | Actual: {dist_km} km @ {pace_str}")
        print(f"      • Variance: {dist_delta:+} km, Pace Delta: {pace_delta_sec:+}s/km -> Precision: {score_pct}%")

        payload = {
            "is_completed": True,
            "actual_distance_km": dist_km,
            "actual_pace": pace_str,
            "actual_duration_min": round(duration_secs / 60, 2),
            "distance_variance_km": dist_delta,
            "pace_variance_sec": pace_delta_sec,
            "compliance_score_pct": score_pct,
            "ingestion_source": "strava_github_action",
            "athlete_notes": notes_str
        }

        success = update_supabase_workout(date_str, payload)
        if success:
            print(f"      ✅ Successfully written to Supabase daily_workouts!")
            synced_count += 1
        else:
            print(f"      ❌ Supabase write failed.")

    print(f"\n🏁 Finished! {synced_count} scheduled run(s) synced to Supabase.")

if __name__ == "__main__":
    main()
