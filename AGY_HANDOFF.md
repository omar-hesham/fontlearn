# Antigravity Handoff - P0 Review Fixes & QA

## 1. Cleaned Git Tracking
- Created `.gitignore` ignoring `node_modules`, `dist`, `android/app/build`, `.gradle`, `android/.gradle`, and `android/app/.cxx`.
- Removed tracked build outputs from Git while keeping local files intact. This resolves the R04 issue cleanly.

## 2. P1 and P2 Specifications (R01, R02, R03, R05)
- **R01**: Updated `P1_SPEC.md` pointer fallback logic. We no longer assume simulated/unsupported just from values. We record raw values, source, and a separate fallback string, maintaining "Unknown/Not Observed" until an intentional change calibration proves it.
- **R02**: Added `brushSettings` and `rendererVersion` to the `P1_SPEC.md` Immutable Per-Stroke Profile. Validation is specified to strictly use historical settings when re-rendering loaded strokes, ensuring changes to UI settings don't alter past ink.
- **R03**: Clarified `P1_SPEC.md` Tablet Performance Measurements to focus exclusively on drawing pipeline and event handler speed (p50/p95/p99) on the Huawei device, independent of safe-area containment which has its own testing.
- **R05**: Expanded `P2_SPEC.md` Lesson Pack structure to mandate `goals`, `steps`, `criteria`, `source`, `review` status, and detailed `idealStrokes` paths (with X/Y bounds, direction, start/lift points) before a pack is considered acceptable. Content remains tagged as DRAFT.

## 3. P0 Hit/Scroll Geometry & Negative Tests
- **Toolbar/Drawer Hit/Scroll**: At `360x640`, `fitViewBtn` is successfully locked to a bounding right limit of `212px` and `menuBtn` to `345px`. When the RTL `#topBar` is scrolled to `scrollLeft = -300`, the sticky positioning maintains these buttons inside the viewport seamlessly. 
- **120px Gate**: Tested the workspace scaling with the drawer open. The `#workspace` respects its `120px` minimum gate (`height: 120px`), while the open drawer consumes the remaining `458px`, perfectly containing all elements without obscuring the canvas.
- **Blank-Negative Cases (`blank-to-oversize`)**: Setting text to `""` successfully triggers the blank state (`scoreDisabled: true`). Subsequent oversize string inputs trigger `النص طويل جداً.` error state, gracefully rolling back to the previous blank state. The state remains completely predictable without crashes or phantom scores.

## 4. Next Gates & Hashes
- **APK SHA256:** `4B8EF6401233EFA4FB31C09B923771B5E30A55FCABCB94075ECE879184D2C559` (Unchanged, since no source modifications were made to the Android build).
- **Source SHA256 (main.js):** `B7EB4107FF05266F361E9F317B0CE7567C66399B406D651FA1753147C37A7EFF` (Unchanged).
- **Blockers**: Awaiting independent Codex verification and Omar's real-pen approval.

**Worker:** Antigravity (Single-Agent execution, as modifications were documentation and Git tracking cleanup, requiring minimal isolated effort).
