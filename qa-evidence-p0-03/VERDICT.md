# Round03 independent QA: return for correction

Candidate: `p0-dist-round03`, AGY run05. No app edits, rebuild, provider dispatch, native operation or comparison-counter changes by this QA agent. All owned browser contexts/browsers closed in runner finally blocks; all browser commands ended before final hash verification. Fresh normal-user host preflight passed at3133.64 MiB against the unchanged2048 MiB floor; the earlier sandbox measurement Access denied attempt launched no browser.

| Gate | Raw result | Evidence |
|---|---:|---|
| Strict supplemental |14/15|supplemental/acceptance.json|
| Focused camera |3/3|focused-camera/acceptance.json|
| Stable scoring |2/2|stable-score/acceptance.json|
| Viewport/reference |5/6|viewport-transitions/acceptance.json|
| Active-camera gaps |4/5|active-camera-gaps/acceptance.json|
| Obsolete font race |0/1|obsolete-font-race/acceptance.json|
| Actual visible clipping |0/1|visible-workspace-clipping/acceptance.json|
| Delivery-synchronized continuous pinch |2/2|continuous-pinch-delivered/acceptance.json|

Four independent product failures remain:

1. Empty and whitespace references expose non-ready state and block grading, but leave scoreBtn.disabled=false. Both cases clear prior popup/heatmap, paint no exercise, create no score/heatmap when clicked, and recover to valid mixed text with score100. The independent obligation list proves this is button-state clarity, not a claim that blank grading succeeds.
2. Rejected requested Amiri font keeps accepted Aref layout/text/version2 and shows a load-error alert, but leaves Amiri selected with layoutReady=true and grading enabled. The accepted reference and selected control are incoherent. The original test fails before its failed-state grading branch; do not claim that branch was observed.
3. Controlled obsolete Amiri rejection while newer Reem Kufi is pending shows a stale error dialog, restores old Aref ready=true, and rolls new text back to default Arabic. After resolving the newer promises, Reem remains selected while layout font is Aref and input is old Arabic. The separate obsolete-font-race-witness/acceptance.json contains all before/rejection/resolved states. Coherence fails before the final direction assertion; no separate direction-only verdict is claimed.
4. At360×340, toolbar consumes190px and workspace min-height remains200px although the actual main-area/viewport clipping intersection is150px. The fitted page bottom390 is50px beyond visible bottom340. This occurs drawer closed, drawer open and after shrinking from360×640. The open drawer collapses to height0 and begins at y390, outside the visible viewport. At360×640 the same open drawer has250px height. The clipping test uses viewport plus every clipping ancestor, not workspace rectangle alone.

The raw continuous-pinch failure is a harness timing issue and is excluded from product defects. Initial scale0.7675, first move0.921 and early second sample0.921; v2 logs prove the second pointer moves subsequently apply1.03794 then1.0745 with fixed workspace1123×614. The delivered fixture waits at most2500ms for both requested coordinates to appear in real pointermove events before sampling, retaining expected1.4× scale, midpoint tolerance and retained RGBA ink. Both original and stable-start variants pass. Do not alter app pinch logic on the basis of the preserved unsynchronized failure. The first witness had misplaced instrumentation; its labelled stable variant is not counted as stable-start evidence. See PINCH_WITNESS_REVISION.md.

Held-pen actual drawer transition, movement before the prior50ms debounce, external Fit and Reset pass with unchanged stationary/release ink and fresh-pointer recovery. Pen-tip alignment and inward small-fit pinch pass. All four fonts now score100 in both stable DPR1 probes, including Dancing Script. Keyboard-sized viewport checks approximate browser geometry only; native Huawei keyboard/insets gates remain separate.

Raw primary groups contain33 rows:28 passes,4 product failures and1 unsynchronized observation failure. The separate delivered2/2 proves continuity; preserved reports/rows are not edited or automatically marked passed. Numerical and font diagnostic witnesses are evidence, not extra unique acceptance-case counts. Core26/26 is parent-owned and separate; frozen model-comparison counters are unchanged.

Final integrity evidence: hash-verification.json checks own pre-test main/style/index hashes, all six source files against root's pre-FREEZE manifest, and all11 built files against own pre-test inventory. The generic built-root helper fingerprints have null main/style because those files are bundled; they are not the source integrity proof. Final harness manifest records each fixture and the preserved original supplemental source. No P0 acceptance until the four failures and native gates are closed.
