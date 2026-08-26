# 📐 DESIGN COMPANION: TMM 2027
## Swiss Industrial & Neo-Brutalist Athletic Design System

> **Design Philosophy & Visual Language**  
> *Inspired by Swiss International Typography, Bauhaus Industrial Modernism, and Dieter Rams / Teenage Engineering functional aesthetics.*  
> *Defined by crisp 2.5px structural borders, subtle rustic warm parchment modules (#FAF8F3 / #F2EFE6), full clean white canvas (#FFFFFF), International Safety Orange accents (#F95700), 45° diagonal industrial hatching, and brushed conical steel textures.*

---

## 1. Visual Philosophy & Core Tenets

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MODULAR ARCHITECTURAL BENTO GRID                      │
├───────────────────────────────────────┬─────────────────────────────────────┤
│         TMM 2027. (Header Block)      │   BRUSHED CONICAL METALLIC STEEL    │
├───────────────────┬───────────────────┴─────────────────────────────────────┤
│ 45° DIAGONAL      │    ← DAY: SUNDAY (AUG 23) →  (Mono Carousel)            │
│ HATCH PATTERN     │                                                         │
├───────────────────┤    Long Run • 7.0 km                                    │
│ INTERNATIONAL     │    Target Pace: 7:35 - 7:45 min/km                      │
│ ORANGE MODULE     │    RPE: 3/10 • Post-run calf armor flush                │
│   7.0  KM         │                                                         │
└───────────────────┴─────────────────────────────────────────────────────────┘
```

1. **Architectural Bento Grid & Structural Borders:**  
   Every component is enclosed in a crisp, high-contrast **2.5px solid black border (`#111111`)**. Modules snap together cleanly in an architectural bento grid with `20px` outer corner radiuses.

2. **Subtle Rustic Parchment on Full Clean White:**  
   The canvas uses a pure clean white background (`#FFFFFF`), on top of which subtle rustic warm parchment modules (`#FAF8F3` / `#F2EFE6`) pop with vintage artisan character and tactile warmth without visual saturation.

3. **Iconic International Orange (`#F95700` / `#FF5500`):**  
   A singular, intense athletic accent color used for key metric highlights, compulsory fueling alerts, active status blocks, and the iconic title period mark (`TMM 2027.`).

4. **Brushed Conical Steel & Industrial Hatching:**  
   * **45° Diagonal Hatching:** Tactile industrial safety stripes pattern with subtle rustic parchment background (`repeating-linear-gradient(-45deg, #111 0px, #111 3.5px, #FAF8F3 3.5px, #FAF8F3 8.5px)`).
   * **Brushed Radial Steel:** Anodized aluminum dial badge reflecting light with a radial conical sweep gradient.

5. **Swiss Grotesk & Precision Monospace Typography:**  
   * **Display & Titles:** Bold Neo-Grotesk (`Inter` / `Helvetica Neue` / `Outfit`, weights 800–900).
   * **Technical Labels & Navigation:** Monospaced metadata (`JetBrains Mono`, `← day: SUNDAY →`, `cadence: 170 SPM`).

---

## 2. Color Palette & Token Architecture

| Token Name | Hex Code | Purpose & Context |
| :--- | :--- | :--- |
| `--tmm-canvas` | `#FFFFFF` | Full clean white canvas backdrop. |
| `--tmm-surface-rustic-parchment`| `#FAF8F3` | Primary subtle rustic parchment card & bento box fill. |
| `--tmm-input-rustic-parchment`| `#F2EFE6` | Secondary subtle rustic input/dropdown/badge fill. |
| `--tmm-pill-rustic-parchment`| `#EAE6DA` | Metric & status tag subtle rustic background. |
| `--tmm-border-black` | `#111111` | 2.5px structural outline strokes & dividers. |
| `--tmm-divider` | `#EBE8DC` | Hairline divider between list items. |
| `--tmm-orange-brand` | `#F95700` | Signature International Safety Orange block & accents. |
| `--tmm-steel-light` | `#E2E2E6` | Conical brushed metal highlight. |
| `--tmm-steel-dark` | `#9E9EA4` | Conical brushed metal shadow edge. |
| `--tmm-text-black` | `#111111` | Primary display headlines & large metrics. |
| `--tmm-text-muted` | `#6B7280` | Secondary metadata, descriptions, mono labels. |
| `--tmm-emerald` | `#10B981` | Precision GPS lock indicator dot. |
| `--tmm-crimson` | `#E11D48` | Stop workout button fill. |

---

## 3. Component Architecture & UI Elements

### 1. Header & Anodized Steel Badge
* **Title:** `TMM 2027.` in bold black grotesk with an orange accent period.
* **Top-Right Module:** Square brushed steel badge featuring conical metallic reflection and `WK 01` / status indicator.

### 2. The Split Hero Card (Signature Element)
* **Left Column (Width: 32%):**
  * Top Half: 45° Diagonal Industrial Hatching block (`#111111` on `#FFFFFF` / `#1A1A1A`).
  * Bottom Half: Solid International Orange block (`#F95700`) with massive bold metric numeral:  
    `7.0` (Font size: 48sp, Weight: 900)  
    `KM` (Font size: 14sp, Weight: 800)
* **Right Column (Width: 68%):**
  * Top Navigation Switcher: Monospaced `← day: SUNDAY →` with clickable arrows to jump between any run in the week.
  * Headline: `Long Run` (22sp, Bold).
  * Target Metric: `Target: 7:35 – 7:45 min/km (RPE 3/10)`.
  * Prehab/Weather subtext in clean neutral gray.

### 3. Cadence Metronome & GPS Modules
* **Cadence Block:** Split selector showing `cadence: AUTO` alongside a live `170 SPM` indicator.
* **Precision GPS Block:** `GPS: OPTIMIZED (±3.2m)` with a solid green dot and clean distance-delta pace display.

### 4. Audio Trigger Timeline (Swiss Checkpoint List)
* Checkpoint items enclosed in clean, bordered boxes:
  * `01 • 0.0 KM`: Kickoff Briefing (10% Music Ducking)
  * `02 • 1.0 KM`: Split Rhythm Check
  * `03 • 45:00 MIN`: Anti-Cramp Salt Capsule [COMPULSORY ORANGE]
  * `04 • 7.0 KM`: Finish & 10-Min Calf Flush

### 5. Spoken Audio Lyrics (High-Contrast Clean Box)
* White matte box with a 2px black border:
  * Active Line: Pitch black bold text with an orange bullet indicator.
  * Inactive Lines: Soft muted gray (`#9CA3AF`).

### 6. Master Industrial Start Button
* Bold rectangular action block with `2.5px` solid black border.
* Background: Solid Pitch Black (`#111111`) with white text:  
  **`START RUN [GPS + AUDIO] →`**

---

## 4. Workout Strategy & Sub-Section Architecture

### A. Recovery Runs (3-Phase Stratification)
1. **Phase 1: Warmup (~15% of total distance / 0.8–1.0 km):** Conversational pace at RPE 2 (~8:00 min/km) to lubricate joint capsules and ease calves into motion.
2. **Phase 2: Main Cruise (~70% of total distance / 3.0–4.0 km):** Steady aerobic base cruise at RPE 3 (7:35–7:50 min/km) with 168 SPM cadence lock for active vascular capillary flushing.
3. **Phase 3: Cooldown (~15% of total distance / 0.8–1.0 km):** Gradual deceleration to RPE 1–2 easing down to a brisk walk before transitioning to calf release.

### B. Speed & Interval Runs (Discrete Granular Sub-Sections)
Every work rep and recovery interval is decomposed into discrete, step-by-step numbered sub-sections:
* **Phase 1: Warmup:** `1.0 km Easy Warmup Jog @ 7:30 min/km (RPE 3)`
* **Discrete Interval Pairs (e.g. 4x 400m / 200m rest):**
  * `Sub-Section 1: 400m Rep 1 @ 5:50 min/km (RPE 8)`
  * `Sub-Section 2: 200m Recovery Jog 1 (RPE 2)`
  * `Sub-Section 3: 400m Rep 2 @ 5:50 min/km (RPE 8)`
  * `Sub-Section 4: 200m Recovery Jog 2 (RPE 2)`
  * `Sub-Section 5: 400m Rep 3 @ 5:50 min/km (RPE 8)`
  * `Sub-Section 6: 200m Recovery Jog 3 (RPE 2)`
  * `Sub-Section 7: 400m Rep 4 @ 5:50 min/km (RPE 8)`
  * `Sub-Section 8: 200m Recovery Jog 4 (RPE 2)`
* **Phase 3: Cooldown:** `1.0 km Easy Cooldown Jog (RPE 2)`
* **Session Complete:** Electrolytes & Lower-body stretch protocol.

### C. Long Runs (Multi-Stage Pacing & Fueling)
* **Stage 1 (First 15%):** Conservative float preventing early glycogen burn.
* **Stage 2 (Middle 70%):** Marathon cruising ($7:35 - 7:45\text{ min/km}$) with **compulsory 45-minute salt capsule anti-cramp alerts** and 90-minute gel alerts.
* **Stage 3 (Final 15%):** Controlled finish holding cadence under fatigue, followed by the 10-minute calf armor release protocol.

---

## 5. Proactive Sunday 6:00 PM Weekly Debrief & AI Coach Vega Studio

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏃 COACH VEGA • SUNDAY 6:00 PM DEBRIEF (WEEK 01)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐  ┌────────────────────────────────────────────┐ │
│ │ 18.5 / 21.0 KM  (88%)   │  │ ⚡ WEDNESDAY PACE SPIKE: 6:38 min/km       │ │
│ │ [88% ADHERENCE BADGE]   │  │ 🩺 FRIDAY PREHAB: LEFT CALF STRAIN FLAGGED │ │
│ └─────────────────────────┘  └────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ 📋 CLINICAL PERFORMANCE SUMMARY (DYNAMIC & UN-TEMPLATED):                   │
│ "Solid foundation work (18.5km logged). Wednesday's 6:38 pace spike placed   │
│ excessive eccentric load in Evo SL 2s, triggering Friday's calf tightness." │
├─────────────────────────────────────────────────────────────────────────────┤
│ 💬 DIAGNOSTIC CHECK-IN QUESTIONS:                                           │
│ 1. Is the tightness in the soleus or upper gastrocnemius?                   │
│ 2. Can you do 10 single-leg calf raises without sharp pain?                 │
│ 3. Did morning stairs feel stiff today?                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ ✍️ ATHLETE FEEDBACK INPUT:                                                  │
│ [ Type or voice-dictate your response...                                  ] │
├─────────────────────────────────────────────────────────────────────────────┤
│ [ ⚡ GENERATE ADAPTIVE WEEK 2 PLAN (SWISS ORANGE #F95700) → ]               │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🔄 PROPOSED SCHEDULE MODIFICATIONS (BEFORE ➔ AFTER DIFF):                   │
│ • Tuesday: Speedwork ➔ 4.0km Gentle Recovery Shakeout + Soleus Eccentrics   │
│ [ ✅ APPROVE & COMMIT TO MASTER PLAN (SOLID BLACK #111111) ]                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Visual Specifications & Design Rules for Debrief Studio:
1. **Canvas & Surfaces:**
   * Sheet Backdrop: Subtle Rustic Warm Parchment (`#FAF8F3`).
   * Card Enclosures: Crisp `2.5px` solid black border (`#111111`) with `16px` corner radius.
2. **Typography & Hierarchies:**
   * Headlines: Swiss Neo-Grotesk (`Inter` / `Helvetica Neue`, weight 800) with mono badge (`COACH VEGA AI`).
   * Telemetry Deltas: Monospaced high-contrast chips (`JetBrains Mono`, `#111111` on `#FAF8F3`).
3. **Accent Colors & Action Triggers:**
   * Primary Action (`GENERATE ADAPTIVE PLAN`): Solid International Orange (`#F95700`) with bold white text.
   * Approval Action (`APPROVE & COMMIT`): Solid Pitch Black (`#111111`) or Forest Emerald (`#059669`) badge.
   * Lock Screen Notification: Pure Swiss White icon with High-Priority reminder badge.

---

*Document Version: 7.0.0 • Swiss Industrial Athletic Edition • TMM 2027 Master Plan*
