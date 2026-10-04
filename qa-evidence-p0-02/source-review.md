# Round 02 — independent P0 source review

2026-10-04. **Partial corrections are present; acceptance remains pending.** Read latest `work/main.js`, `work/style.css`, `work/P0_CORRECTION_SPEC.md`, prior `P0_PEN_REVIEW.md`, and `tooling/active-skill-snapshot.json`. No browser, build, provider dispatch, app edits or extra agents. Run04 failure is not evidence of an unchanged source tree.

Reviewed hashes:

- main.js: `AA9281078438F716C31DFBE919DF2A67FC833FDBBBE6EAB78900CAFEEA247777`
- style.css: `E713376063D060BC94E6F0BAC240F078E2750087332296856024B94C046A2C12`

Authoritative skill metadata read: snapshot `agy-delegate-20261003T203459646Z`, tree SHA256 `f529dd57ee961d104fbd3557b0cae9d7ecb1f994a94d35a4a2af3aa7b1a05a1e`. This records tooling provenance; it does not certify run04 changes or failed provider subagent reviews.

## Actual corrections found

| Requirement | Latest source | Verdict from source only |
|---|---|---|
| One world/display/input transform | CSS42-55 sets container1200x800 and all canvas layers fill it; JS28-29/130-138 uses matching world/DPR; inverse JS387-394 subtracts workspace origin and camera translation before dividing scale | Prior CSS double scaling is removed. Retest visible tap, translated pinch, DPR1/2.1875 and full-page fit. |
| Inward pinch below0.5 | JS509-514 computes minScale <= half fitted scale; JS538-546 uses it and preserves initial logical midpoint | Prior first-inward enlargement clamp is removed for a nonzero stable workspace. At fit0.3 and distance ratio0.75, the source now permits0.225. |
| Resize interruption | New JS112-123 clears ownership/cache/pinch; JS125-126 invokes it before refit; stored points remain in strokes | Prevents the old connector **after** the resize callback runs. The helper's empty comment block113-115 is not a commit mechanism, but P0 strokes already contain their visible samples, so no source evidence of lost completed ink. Timing/other layout changes remain unresolved below. |
| Standalone palm | JS452-453 retains40px threshold; JS555 rejects before pointerCache/owner/stroke creation | Prior palm-alone ink and palm cache contamination are removed for pointerdown. |
| Saturated touch stylus and ordinary0.5 fingers | JS446 now accepts pressure1; latch JS598-599; owner protection JS560-563 | Narrow pressure1 fixture is protected; ordinary0.5/no-tilt contacts still take the finger pinch branch. This heuristic does not prove hardware pressure support; physical pen calibration remains P1. |
| Reference pending state | JS334 marks false immediately; epoch checks350/354; publication356-359; score guard649 checks marker and layout | Pending scoring path is blocked. Load/rejection readiness still has gaps below. |
| Bearing fit | JS199/220/230/234 checks each left/right ink bearing against its64px half-page allowance | A real correction of the prior total-width-only check. Root owns font/pixel acceptance. |

Pressure0 hold-last, pressure1 thickness, ellipse radii >=0.5 logical units, sampled angle/thickness, frozen stroke color/ratio, owner-only append/end, and cancel/lostcapture handlers remain at JS397-506,585,607,614-638. No source delta here justifies reopening their accepted behavior. Clear/blur now share cancelActiveGestures (640-642,716-721); absence of explicit releasePointerCapture alone is still not proof of a failure.

## Unresolved concrete risks and gates

1. **Workspace geometry changes are not observed (correction spec2/3).** Only `window.resize` is registered (JS148-151). Drawer controls merely change classes (727-728), while CSS113 and125-137 animate panel width/height. There is no ResizeObserver, visualViewport listener, transition completion handling, or equivalent fit/gesture coordination. Opening the desktop drawer moves the workspace origin; a held pen's next sample subtracts the new rect.left while its previous world point remains unchanged. Sidebar changes therefore can introduce a connector without any window resize, and the previously fitted page can become clipped. Root gate: hold pen or pinch while toggling drawer; finish transition; verify page fit, retained world data, pointer-under-tip and no connector/jump.

2. **Cancellation happens only after a50ms resize debounce (JS148-151→125-126).** Until the callback runs, isDrawing and old camera/pinch state remain live. A resize that wraps the toolbar or otherwise changes workspace origin allows JS388-393/607-611 to append against the new rect before interruption. The older stationary-resize fixture may pass if it waits for the callback; add a move during the debounce, including toolbar wrap/orientation. Cancel/rebase at the geometry-change boundary, rather than assuming delayed cleanup covers every sample. Fit/Reset button handlers109-110 also change camera without terminating/rebasing a held gesture; their multitouch interaction needs the same explicit policy.

3. **Useful narrow/keyboard workspace is not established by the added min-height (CSS34-40).** `min-height:200px` was added, but no matching min-width or bounded header/panel allocation was added. `#main-area` remains flex1/overflow:hidden (28-32), topBar wraps (67-69), and the narrow drawer still requests50vh (135-137). A200px workspace may exceed the remaining visible height and be clipped by ancestors instead of staying useful. This is a source risk, not a claim of a newly run geometry test. Root gate:360x340, toolbar wrap, open drawer, native scrolling and real keyboard/visualViewport; check visible intersection as well as getBoundingClientRect dimensions.

4. **Font-load failure is still swallowed (JS346-348).** The code continues to measure/publish currentFont and sets ready=true at358 even if requested font loading rejects; a fallback can be mislabeled as the installed font. Spec requires coherent recovery from load failure. Preserve the accepted revision or explicitly expose failed/unverified font state; root should inject rejection and verify displayed font/layout/version and score remain coherent.

5. **Readiness rejection paths require validation (JS336-340,362-366).** Both unconditionally set the DOM marker true while retaining the old templateLayout. Rejection after a previously accepted revision can legitimately restore it, but first-load rejection has no installed revision (`templateLayout.ready=false` at60). Marker and actual object then disagree; score649 prevents grading, so this is an inconsistent readiness signal rather than proof of stale-score acceptance. Require marker true only for an installed accepted revision, with text/font/version restored coherently. Empty/whitespace still becomes a space at343 and a ready layout; the requested explicit non-exercise state is not implemented here.

6. **Pointer hover defensive guard remains absent (JS607-611), inherited.** Same-owner buttons0 moves can still append while ownership is active. Ordinary hover after pointerup is blocked by cleanup. Keep this separate from observed native hover failure; root decides whether its existing correction scope requires a synthetic contact-loss fixture.

No fresh browser failures or passes are claimed. Prior focused evidence describes the older candidate hash `5F887B34...` and cannot accept this revision. Root must rerun its serialized camera/ownership/readiness/viewport gates against the hashes above, then Huawei checks as applicable. Actual pen feel and sensing remain pending Omar's physical test.
