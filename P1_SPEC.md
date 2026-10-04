# P1 Specifications & Assets Preparation

## 1. Pointer Calibration & Provenance
**Goal:** Display real pointer/pressure/tilt data and its source (fallback if unsupported).
- **UI:** A "Calibration & Diagnostics" modal.
- **Data to capture per event:** `pointerType` (pen, touch, mouse), raw `pressure` reading, raw `tiltX` / `tiltY` readings, and `timestamp`.
- **Fallback logic:** Do not infer unsupported or simulated state strictly from values (e.g. pressure=0.5 or 1, tilt=0). Instead, separate the raw reading from the fallback state. Record "unknown / not observed" initially. Require an intentional change calibration (e.g., asking the user to press harder or tilt the pen) to confirm support. If no variance is observed during calibration, flag as "Support Inconclusive" and fall back gracefully without overriding raw measured values.

## 2. Tool Settings (Adjustable Pressure/Width/Angle/Smoothing)
**Goal:** Allow users to override or adjust tool behavior.
- **UI:** Expand `.brush-settings` into a dedicated panel.
- **Controls:**
  - Base Width slider (5 - 60px)
  - Pressure Sensitivity curve (None, Linear, Logarithmic)
  - Nib Angle override (0 - 360°)
  - Smoothing factor (None, Low, High) using moving average.
- **Reset & Preview:** A small live preview canvas showing a sample 'S' curve with the current tool profile. A "Reset to Defaults" button.

## 3. Six Meaningfully Different Tools (3 Mechanisms)
**Goal:** Diverse toolset independent of fonts/lessons.
1. **Classic Calligraphy Pen (Mechanism A: Angled Flat Nib):** Fixed angle, thickness varies strictly by stroke direction relative to nib angle.
2. **Flexible Nib Pen (Mechanism B: Pressure-based):** Thickness scales directly with applied pressure. Low pressure = thin line, high pressure = thick line.
3. **Pencil / Chalk (Mechanism C: Textured/Alpha-based):** Uses an alpha-brush image or low opacity overlapping circles.
4. **Marker / Highligher (Mechanism A):** Fixed angle but with multiply blend mode and high baseline thickness.
5. **Dynamic Brush (Mechanism B + Smoothing):** Pressure-based with high smoothing (spring physics) to simulate real brush drag.
6. **Tilt-Shading Pencil (Mechanism B + Tilt):** Stroke width expands when the pen is heavily tilted (simulating graphite side-shading).

## 4. Immutable Per-Stroke Profiles
**Goal:** Keep history of what was drawn and how.
- **Data Structure:**
  ```json
  {
    "toolId": "flexible_pen",
    "color": "#000000",
    "startTime": 1696420000000,
    "rendererVersion": 1,
    "brushSettings": {
      "baseWidth": 20,
      "pressureCurve": "linear",
      "nibAngle": 45,
      "smoothingFactor": "low"
    },
    "points": [
      { "x": 120, "y": 150, "pressure": 0.4, "tiltX": 15, "tiltY": 0, "timeOffset": 12 }
    ]
  }
  ```
- **Validation:** When loading a saved project or restoring strokes after settings change, the rendering algorithm must strictly use the historical `brushSettings` and `rendererVersion` stored within the stroke profile. Changing current UI settings must never mutate the rendering of already completed strokes.

## 5. Eight Intentional Local Licensed Fonts
**Goal:** 8 licensed fonts with previews.
**Current (4):**
1. Amiri (OFL) - Arabic Naskh
2. Aref Ruqaa (OFL) - Arabic Ruqaa
3. Reem Kufi (OFL) - Arabic Kufi
4. Dancing Script (OFL) - English Cursive
**Proposed Additions (4):**
5. **Cairo** (OFL) - Modern Arabic Sans (Good for UI & geometric tracing)
6. **Scheherazade New** (OFL) - Traditional Arabic Naskh (High legibility)
7. **Noto Nastaliq Urdu** (OFL) - Nastaliq style (Complex verticality)
8. **Pacifico** (OFL) - English brush script

*Assets for the 4 new fonts will be downloaded to `fonts/` directory and their OFL licenses copied to `public/font-licenses/` before P1 implementation.*

## 6. Tablet Performance / Handler Measurements
**Goal:** Measure drawing performance (frame rendering and event handler speed) on the actual device (Huawei tablet).
- **Metrics:** Record drawing event handler execution time and frame intervals. Report summaries including p50, p95, and p99 metrics.
- **Testing Scope:** Measure load across different tools, tracking both the software overhead (tool complexity) and hardware performance.
- **Independence:** These measurements focus strictly on rendering and input pipeline performance. Safe-area containment and OS-gesture rejection (such as edge swipes) are handled in separate, dedicated tests rather than relying solely on CSS rules.
