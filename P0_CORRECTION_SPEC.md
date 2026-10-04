# P0 candidate correction contract

This is an unaccepted candidate. Read P0_SPEC.md and the independent reports referenced in the brief. Preserve the current work and make a focused correction; do not start P1.

## Confirmed integration failures

1. Final CSS makes #canvasContainer and canvases 100% of the viewport, while the JS camera/inverse mapping uses a 1200x800 world. Set the page's CSS size explicitly to 1200x800 logical pixels; canvases fill that fixed page. Backing buffers remain DPR-scaled. Validate visible ink under the actual pointer, zoom/pan world mapping, exact reference scoring, and full-page fit independently.
2. Protect flex layout with appropriate min-width/min-height and bounded tool panel/header/content dimensions. Narrow screens and a keyboard-height viewport must retain a useful workspace; drawer content must scroll natively. Observe actual workspace bounds including drawer transitions and visualViewport changes; no feedback loops. View changes do not rebuild the reference layout or alter retained world ink.
3. fitView can initialize below scale .5, but pinch clamps to .5, so an inward pinch can zoom in. Use consistent feasible limits and preserve the initial midpoint, including small screens. A layout change during an active pen/pinch must not create an uncommanded connecting segment or zoom jump; safely rebase or end the gesture and document behavior.
4. A standalone broad palm currently creates ink. Reject it before ownership/stroke creation and exclude it from pinch; preserve narrow pressure-touch drawing. Pressure 1 is a real saturation endpoint: do not demote a pressure-reporting narrow touch tip merely because it starts at 1. Ordinary .5 touch contacts must still support normal two-finger pinch. Keep owner protected when another contact is released first. These are inherited acceptance gaps, not necessarily new P0 regressions.

## Template/score consistency

Declare data-layout-ready=false immediately when a real reference update begins, and true only after the current font/layout revision is installed. Never grade a pending or stale reference. Restore readiness/valid text/layout coherently after rejection or load failure. Snapshot/version checks must match actual displayed template and score mask, including Ghost 0.

Horizontal fit must position measured INK bounds, including asymmetric left/right bearings, within both64px margins; testing total width alone with a center anchor is insufficient. Preserve Arabic combining clusters, words, explicit blank-line spacing, and all valid text. Scoring actual pixel-perfect reference should reach100 for every local font at DPR1 and2.1875; investigate discrepancies rather than lowering expectations. Empty reference needs a clear non-exercise state.

## Execution ownership / permissions

One integrator writes all core source files. Native invoke_subagent may run independent read-only reviews of template/geometry and input/layout; record actual IDs and findings. Do not let parent and child overwrite the same UI files. Existing human approval covers source sharing and app corrections, and the preceding interactive session approved bounded native file edits. Use native file editing, not Bash heredocs. Do not run shell commands, alter permission settings, bypass review, invoke unrelated MCP services, or deploy. Root runs syntax/build/browser/native gates. Return actual files changed, agent evidence, unresolved issues; do not claim unrun gates passed.
