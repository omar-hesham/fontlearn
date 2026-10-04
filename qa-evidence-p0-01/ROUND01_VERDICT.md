# Independent P0 QA round 01

Verdict: candidate rejected. No app source was edited by this QA agent. Independent Vite build succeeded; source and all built files stayed unchanged through testing, verified in `hash-verification.json` and `final-hash-verification.json`. Every browser process launched by these runners is closed. This round does not close Huawei, physical M-Pencil, keyboard/insets, or SystemBars acceptance.

## Confirmed camera defects

`focused-results/acceptance.json` records three failures with no JavaScript errors or external requests:

1. A real client-space pen tap at (531.951,291.622) rendered its ink centroid at (504.331,236.801), a displacement of61.386 CSS pixels. This independently confirms displayed-canvas dimensions and inverse pointer mapping disagree.
2. On a360x640 viewport, shrinking two-finger separation to75% enlarged camera scale from0.3 to0.5. The first inward pinch jumps in the wrong direction when initial fit is below the fixed gesture minimum.
3. Resizing while an active pen remained at the same client position produced1117 additional ellipse stamps spanning557.596 world units, compared with20-unit nib width. Preserved existing bitmap data does not prevent a new artificial connector.

These are new camera behaviors introduced with the fixed exercise world.

## Confirmed scoring mismatch

`stable-score-results/acceptance.json` contains two failed controlled probes, with and without zoom. At DPR1, Aref Ruqaa, Amiri and Reem Kufi scored100 for copied reference pixels. Dancing Script scored99 for the mixed text `Practice ABC 123 العربية` followed by `Second line`.

The probes waited for the expected current font and complete content, then confirmed an unchanged template bitmap across150ms plus50ms, copied the bitmap once, and verified layout and reference hash stayed unchanged during scoring. This result is not explained by an unfinished layout read. It establishes a mismatch between displayed reference and scoring mask; it does not yet identify which rendering state causes it.

## Supplemental coverage and inherited gaps

`results/acceptance.json`:8/15 passed,7 failed, no browser, external-request, or startup errors. Deep snapshots, prior-ink preservation through sequential pinch, empty-template rejection, stale completed-score invalidation, active Clear, and drawer touch scrolling passed.

Broad palm alone created2896 ink pixels; narrow touch contact at pressure1 lost ownership when an ordinary24px contact arrived, discarding the stroke as pinch. Source comparison by the pen supervisor identifies these as inherited acceptance gaps rather than new regressions.

Two palm-only-release cases failed their expected world-endpoint assertions. The confirmed CSS/world mapping defect confounds those results; they are not sufficient evidence that releasing the palm actually terminated the stylus. Repeat them after camera correction.

The360x340 keyboard-sized browser viewport failed the minimum drawing area check. This is a browser geometry failure; native keyboard/inset acceptance remains separately required.

The original supplemental runner is preserved. `focused-camera.cjs` and `stable-score.cjs` reuse its frozen helpers and write to separate evidence folders. `COVERAGE_REVIEW.md` documents the initial coverage review; the supplemental run added a fifteenth classification-isolation case after that initial review.

Root independently identified two original-harness observability/fixture issues: a590-character English fixture exceeded the declared500-character input limit, and the excessive-input message was a native alert that the harness dismissed without logging. These require test fixture/dialog observation corrections, not weaker no-loss or rejected-input assertions. Neither observation changes the confirmed camera or stable-score failures above.
