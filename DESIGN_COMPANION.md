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
* Background: Solid International Orange (`#F95700`) or Pitch Black (`#111111`) with white text:  
  **`START RUN [GPS + AUDIO] →`**

---

*Document Version: 5.0.0 • Swiss Industrial Athletic Edition • TMM 2027 Master Plan*
