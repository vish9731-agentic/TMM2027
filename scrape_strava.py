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
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://xtdfhxczdlgyhkqsltyq.supabase.co").strip().rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0ZGZoeGN6ZGxneWhrcXNsdHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMzg2OTUsImV4cCI6MjEwMjcxNDY5NX0.ARI4z_eWMhBQiF66xTXKDOrspfsBQjnG81qxaBhEuww").strip()

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
    """Robustly extracts local YYYY-MM-DD from various possible Strava date fields without erroneous timezone drift."""
    for field in ["start_date_local", "start_date_local_raw", "start_date", "start_day", "start_time"]:
        val = act.get(field)
        if not val:
            continue
        # Check standard ISO YYYY-MM-DD (already represents athlete local date in Strava web models)
        m = re.search(r"(\d{4}-\d{2}-\d{2})", str(val))
        if m:
            return m.group(1)
        # Check numeric epoch timestamp
        if isinstance(val, (int, float)) and val > 1000000000:
            ts = val / 1000.0 if val > 1000000000000 else val
            return datetime.fromtimestamp(ts, IST_TZ).strftime("%Y-%m-%d")
        # Check month name format (e.g. Nov 02, 2026)
        try:
            parsed = datetime.strptime(str(val)[:20], "%b %d, %Y")
            return parsed.strftime("%Y-%m-%d")
        except Exception:
            pass
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

def compute_splits_from_streams(distance_stream, time_stream, hr_stream=None):
    """
    Computes precise per-kilometer splits from second-by-second Strava telemetry streams.
    Extracts split-by-split distance, pace, duration, and heart rate.
    """
    if not distance_stream or not time_stream or len(distance_stream) != len(time_stream):
        return [], None, None

    total_points = len(distance_stream)
    splits = []
    cur_km = 1
    last_idx = 0
    last_dist = 0.0
    last_time = 0

    avg_hr = None
    max_hr = None
    if hr_stream and len(hr_stream) == total_points:
        valid_hrs = [int(h) for h in hr_stream if h and h > 30]
        if valid_hrs:
            avg_hr = int(round(sum(valid_hrs) / len(valid_hrs)))
            max_hr = int(max(valid_hrs))

    for i in range(total_points):
        d = float(distance_stream[i])
        t = int(time_stream[i])
        target_d = cur_km * 1000.0

        if d >= target_d:
            split_dist_km = (d - last_dist) / 1000.0
            split_time_sec = t - last_time
            if split_dist_km > 0 and split_time_sec > 0:
                pace_sec = split_time_sec / split_dist_km
                pm = int(pace_sec // 60)
                ps = int(round(pace_sec % 60))
                pace_str = f"{pm}:{ps:02d} min/km"
            else:
                pace_sec = 0
                pace_str = "N/A"

            split_hr_val = None
            if hr_stream:
                sub_hrs = [int(h) for h in hr_stream[last_idx:i+1] if h and h > 30]
                if sub_hrs:
                    split_hr_val = int(round(sum(sub_hrs) / len(sub_hrs)))

            splits.append({
                "split": cur_km,
                "km": f"Km {cur_km}",
                "distance_km": round(split_dist_km, 2),
                "pace": pace_str,
                "pace_sec": round(pace_sec),
                "duration_sec": split_time_sec,
                "heart_rate": split_hr_val
            })

            cur_km += 1
            last_idx = i
            last_dist = d
            last_time = t

    # Remainder split (final partial kilometer if >= 150m)
    rem_dist = float(distance_stream[-1]) - last_dist
    rem_time = int(time_stream[-1]) - last_time
    if rem_dist >= 150:
        rem_km = rem_dist / 1000.0
        pace_sec = rem_time / rem_km if rem_km > 0 else 0
        pm = int(pace_sec // 60)
        ps = int(round(pace_sec % 60))

        split_hr_val = None
        if hr_stream:
            sub_hrs = [int(h) for h in hr_stream[last_idx:] if h and h > 30]
            if sub_hrs:
                split_hr_val = int(round(sum(sub_hrs) / len(sub_hrs)))

        splits.append({
            "split": cur_km,
            "km": f"Km {cur_km} (final)",
            "distance_km": round(rem_km, 2),
            "pace": f"{pm}:{ps:02d} min/km",
            "pace_sec": round(pace_sec),
            "duration_sec": rem_time,
            "heart_rate": split_hr_val
        })

    return splits, avg_hr, max_hr

def fetch_strava_activity_splits_and_hr(activity_id):
    """
    Fetches detailed per-km splits and optical heart rate from Strava activity telemetry.
    Uses Strava's telemetry streams endpoint (/streams) with fallback to activity HTML.
    """
    if not activity_id or not STRAVA_COOKIE:
        return {"splits": [], "avg_hr": None, "max_hr": None}

    cookie_header = STRAVA_COOKIE
    if not cookie_header.startswith("_strava4_session="):
        cookie_header = f"_strava4_session={cookie_header}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest",
        "Cookie": cookie_header,
        "Referer": "https://www.strava.com/athlete/training"
    }

    # 1. Primary: Strava Telemetry Streams Endpoint
    streams_url = f"https://www.strava.com/activities/{activity_id}/streams?stream_types%5B%5D=distance&stream_types%5B%5D=time&stream_types%5B%5D=heartrate"
    try:
        req = urllib.request.Request(streams_url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as response:
            stream_json = json.loads(response.read().decode("utf-8"))
            if isinstance(stream_json, dict) and "distance" in stream_json and "time" in stream_json:
                d_stream = stream_json.get("distance", [])
                t_stream = stream_json.get("time", [])
                hr_stream = stream_json.get("heartrate")

                splits, avg_hr, max_hr = compute_splits_from_streams(d_stream, t_stream, hr_stream)
                print(f"      📊 Activity {activity_id}: computed {len(splits)} splits from stream (HR: avg={avg_hr}, max={max_hr})")
                return {
                    "splits": splits,
                    "avg_hr": avg_hr,
                    "max_hr": max_hr
                }
    except Exception as e:
        print(f"      ℹ️ Streams endpoint note for {activity_id}: {e}")

    # 2. Secondary Fallback: Activity Page HTML Scraping
    url = f"https://www.strava.com/activities/{activity_id}"
    try:
        html_headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Cookie": cookie_header,
            "Referer": "https://www.strava.com/athlete/training"
        }
        req = urllib.request.Request(url, headers=html_headers)
        with urllib.request.urlopen(req, timeout=15) as response:
            html = response.read().decode("utf-8", errors="replace")

            splits_data = []
            m = re.search(r'"splits_metric"\s*:\s*(\[\{.*?\}\])', html)
            if not m:
                m = re.search(r'&quot;splits_metric&quot;\s*:\s*(\[.*?\])(?:,\s*&quot;|})', html)
                if m:
                    unescaped = m.group(1).replace("&quot;", '"')
                    try: splits_data = json.loads(unescaped)
                    except Exception: pass
            else:
                try: splits_data = json.loads(m.group(1))
                except Exception: pass

            formatted_splits = []
            if splits_data and isinstance(splits_data, list):
                for s in splits_data:
                    split_num = s.get("split") or (len(formatted_splits) + 1)
                    dist_m = float(s.get("distance", 1000.0))
                    moving_sec = int(s.get("moving_time") or s.get("elapsed_time", 0))
                    split_hr = s.get("average_heartrate")
                    split_hr_val = int(round(float(split_hr))) if split_hr else None

                    split_km = dist_m / 1000.0
                    pace_sec = moving_sec / split_km if split_km > 0 and moving_sec > 0 else 0
                    pm = int(pace_sec // 60)
                    ps = int(round(pace_sec % 60))

                    formatted_splits.append({
                        "split": split_num,
                        "km": f"Km {split_num}",
                        "distance_km": round(split_km, 2),
                        "pace": f"{pm}:{ps:02d} min/km" if pace_sec > 0 else "N/A",
                        "pace_sec": round(pace_sec),
                        "duration_sec": moving_sec,
                        "heart_rate": split_hr_val
                    })

            avg_hr = None
            max_hr = None
            hr_m = re.search(r'"average_heartrate"\s*:\s*([0-9.]+)', html)
            if hr_m: avg_hr = int(round(float(hr_m.group(1))))
            max_hr_m = re.search(r'"max_heartrate"\s*:\s*([0-9.]+)', html)
            if max_hr_m: max_hr = int(round(float(max_hr_m.group(1))))

            return {
                "splits": formatted_splits,
                "avg_hr": avg_hr,
                "max_hr": max_hr
            }
    except Exception as e:
        print(f"      ℹ️ Note: Detailed split fetch for activity {activity_id}: {e}")
        return {"splits": [], "avg_hr": None, "max_hr": None}

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

        # Check heart rate telemetry from activity feed
        if idx == 0:
            print(f"   ℹ️ Sample raw activity keys: {list(act.keys())}")
            # Check if heartrate exists in act
            hr_keys = {k: act[k] for k in act if 'hr' in k.lower() or 'heart' in k.lower()}
            print(f"   ℹ️ Sample HR fields in raw feed: {hr_keys}")

        raw_avg_hr = act.get("average_heartrate") or act.get("avg_hr")
        raw_max_hr = act.get("max_heartrate") or act.get("max_hr")
        avg_hr = int(round(float(raw_avg_hr))) if raw_avg_hr else None
        max_hr = int(round(float(raw_max_hr))) if raw_max_hr else None

        # Fetch detailed per-km splits and optical heart rate
        act_id = act.get("id")
        splits = []
        if act_id:
            details = fetch_strava_activity_splits_and_hr(act_id)
            splits = details.get("splits", [])
            if not avg_hr and details.get("avg_hr"):
                avg_hr = details.get("avg_hr")
            if not max_hr and details.get("max_hr"):
                max_hr = details.get("max_hr")

        hr_str = f" • HR: {avg_hr} bpm" if avg_hr else ""
        print(f"[{idx+1}] \"{name}\" • Type: {act_type} • Date: {date_str} • Distance: {dist_km} km • Pace: {pace_str}{hr_str}")

        is_run = any(t in act_type.lower() for t in ["run", "jog", "treadmill"]) or act_type == "" or "run" in name.lower() or "vdhm" in name.lower() or "shakeout" in name.lower()
        if not is_run or dist_km <= 0 or date_str == "Unknown Date":
            continue

        item = {
            "name": name,
            "type": act_type or "Run",
            "date_str": date_str,
            "dist_km": dist_km,
            "duration_secs": duration_secs,
            "pace_str": pace_str,
            "splits": splits,
            "avg_hr": avg_hr,
            "max_hr": max_hr
        }
        activities_by_date.setdefault(date_str, []).append(item)

    synced_count = 0

    # Process each day with intelligent multi-run / crash resolution
    for date_str, runs in activities_by_date.items():
        planned_wo = query_supabase_workout(date_str)
        if not planned_wo:
            print(f"   ℹ️ Date {date_str} is outside the 22-week plan dates in Supabase.")
            continue

        planned_dist = float(planned_wo.get("distance_km") or 0)
        wo_type = str(planned_wo.get("workout_type") or "").lower()
        target_pace = planned_wo.get("target_pace", "N/A")

        # Guard: NEVER match or overwrite Rest or Strength days with runs
        if planned_dist <= 0 or "rest" in wo_type or "strength" in wo_type:
            print(f"   ℹ️ Skipping non-running day {date_str} ({planned_wo.get('workout_type')}, planned: {planned_dist} km)")
            continue

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
        if primary_run.get("avg_hr"):
            print(f"      • Heart Rate Telemetry: Avg {primary_run['avg_hr']} bpm (Max {primary_run.get('max_hr') or 'N/A'} bpm)")
        if primary_run.get("splits"):
            print(f"      • Kilometer Splits: {len(primary_run['splits'])} splits captured from Strava")
        print(f"      • Variance: {dist_delta:+} km, Pace Delta: {pace_delta_sec:+}s/km -> Precision: {score_pct}%")

        payload = {
            "is_completed": True,
            "actual_distance_km": dist_km,
            "actual_pace": pace_str,
            "actual_duration_min": round(duration_secs / 60, 2),
            "distance_variance_km": dist_delta,
            "pace_variance_sec": pace_delta_sec,
            "compliance_score_pct": score_pct,
            "actual_splits": primary_run.get("splits"),
            "avg_heart_rate": primary_run.get("avg_hr"),
            "max_heart_rate": primary_run.get("max_hr"),
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
