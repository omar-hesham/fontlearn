# Frozen P0 pen review — correction required

Independent source/diff review, 2026-10-03. Candidate `audits/20261003-learning-implementation/work/main.js` SHA256: `5F887B34BAD03A4A04551E152BA8D227C346F2E717BC0F11E04B0D8120930474`. Compared with canonical `main.js`; inspected candidate CSS after root identified the dimension mismatch. No application edits or provider dispatch. Numeric examples below are source-derived counterexamples, not claims of physical pen tests. Independently read QA's [supplemental acceptance](../qa-agent/results/acceptance.json), containing15 cases/8 pass/7 fail, and [hash verification](../qa-agent/hash-verification.json), which confirms the reviewed work sources and built assets unchanged. The acceptance file's built-root main.js/style.css hashes are null; use the separate hash verification for source integrity.

## New P0 corrections

1. **Input and visible ink use different coordinate transforms.** Candidate JS28-29 fixes world1200x800; JS119-125 makes backing buffers match that world; JS371-378 inverts only workspace origin, camera translation and camera scale. Candidate CSS41-54 instead sizes both container and canvases to100% of workspace. Thus displayed world coordinates also acquire `workspaceWidth/1200` and `workspaceHeight/800`, absent from the inverse. With a480x320 workspace and fit scale0.4, world point600,400 appears at96,64 from its origin; a tap there stores240,160, whose ink appears at38.4,25.6. Observable criterion: the ink tap/segment must appear directly under the pointer at the visible template position after fit and translated pinch, at multiple viewport sizes. Give all four layers/container fixed world CSS dimensions, or implement one equivalent forward/inverse transform; do not patch only drawingCanvas.

2. **Fit and pinch have inconsistent scale limits.** JS89-97 permits fitted scales below0.5; JS515-521 clamps every pinch update to[0.5,5]. At fitted scale0.4, a10% inward movement computes0.36 but applies0.5, a25% enlargement. This was introduced by new sub0.5 fit scales; the old pinch clamp was retained. Observable criterion: the first inward pinch below0.5 must shrink or remain at an explicitly documented limit without enlargement/jump, with its logical midpoint invariant. Use compatible fit/pinch limits and record the chosen policy.

3. **Resizing changes an active gesture's coordinate system without rebasing/ending it.** JS131 always fits after resize; JS135-138 schedules that during drawing/pinch. JS493-503 keeps the old pinchLogicalMidpoint, and JS558-585 keeps the old lastPt. Example after fixing CSS: workspace480x320→720x480 changes scale0.4→0.6; unchanged client point240,160 maps600,400→400,266.67, and the next move connects these unrelated world positions. Observable criterion: resize/orientation during held pen or two-finger pinch must not introduce a connector/jump. Define and test either safe gesture termination or a rebase preserving the active world anchor. Completed ink geometry must remain unchanged.

## Preserved by exact source comparison

| Behavior | Candidate lines | Independent finding |
|---|---|---|
| Foreign pointer cannot append/end active stroke |581,592-602 | Same owner checks as canonical359,370-380. |
| Broad second palm does not steal active ink |436-437,534-537 |40px cutoff and guard unchanged; pressure1 plus70px palm remains guarded even though pressure1 alone is not classified stylus. |
| Stylus recognition stays latched |572-574 | Once true, later pressure0.5/1 does not clear it. |
| Contact/release pressure0 preserves last pressure |453-465 | Same hold-last then clamp logic; pressure1 remains valid for thickness. |
| Cancel/lostcapture/blur stop drawing |588-623 | Same cleanup; terminal endpoint appended only for pointerup. Foreign termination does not stop owner. |
| Color/ratio and sampled geometry replay |399-424,468-487,559 | Frozen stroke color/ratio and derived angle/thickness replay unchanged. Minimum ellipse radii0.5 and adaptive spacing unchanged381-386,407-419. |
| Completed ink survives viewport change |112-131 | Fixed world buffer retains ink; DPR changes replay stored geometry with setTransform. Visible/input correctness is still blocked by correction1. |

## Inherited gaps — do not call these new P0 regressions

- **Saturated touch stylus plus ordinary finger:** candidate430 equals canonical206 (`pressure!==1`). A first touch at pressure1 with zero tilt is unrecognized; a subsequent24px finger reaches539-543 and pops its stroke. Broad70px palm follows the protective isPalm branch instead. Saved QA case `Narrow pressure1 touch stylus retains ownership with an ordinary24px contact` fails with `Stylus stroke was discarded as a pinch`. Consider pressure1 a stylus candidate while preserving normal touch pinch, with an explicit tested policy rather than claiming constant pressure proves hardware identity.
- **Standalone broad palm draws:** candidate532 computes isPalm but only consults it inside the multi-pointer branch534-537. The first broad touch therefore reaches552-565 and creates ink, exactly like canonical310-342. Saved QA case `Standalone broad palm creates no ink and subsequent pen recovers` records2896 pixels. An early palm rejection must also prevent rejected palms from contaminating pointerCache/pinch.
- **buttons0 move while owner remains active:** candidate581 has no button/contact guard, like canonical359. Injecting owner pen down then same-owner buttons0/pressure0 move would append hold-last ink. Ordinary hover after pointerup is already blocked by activePointerId cleanup; do not describe this as a reproduced real-pen hover failure without a physical/native trace.
- **No explicit releasePointerCapture:** unchanged source. Absence alone does not establish failure: native pointerup/cancel releases capture through browser behavior, and cleanup clears ownership. Test clear/blur/interruption with capture if required; do not demand an unrelated rewrite solely from this omission.

QA's `Pointer maps to world coordinates after translated pinch` fails, corroborating the transform issue. Its pressure0.7/1 `Touch stylus survives palm-only release` failures rely on endpoint-stamp assertions confounded by the same CSS geometry; they do not independently prove ownership/termination failure. `Clear during active pen cannot draw again until a new pointerdown` passes, giving actual evidence of recovery without explicit releasePointerCapture.

Subsequently independently read [focused installed-Chrome evidence](../qa-agent/focused-results/acceptance.json): all3 focused cases fail, confirming the visible pointer/ink mismatch, first inward pinch enlargement below0.5 and a long spurious connector on stationary active-pen resize. These are observed new P0 camera defects, not only source-derived risks; the result links screenshots. Correction1-3 therefore remain required.

Verdict: source preservation of the core pen functions passes, but P0 pen interaction acceptance requires correction. Correct and independently retest1-3 plus the agreed inherited palm/pressure cases. Browser/CDP tests do not close Omar's physical M-Pencil acceptance.
