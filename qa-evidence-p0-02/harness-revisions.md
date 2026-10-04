# Independent harness revisions

The immutable p0-round01 result was 17/25. Two failures were caused by the harness, rather than demonstrated app defects:

- English wrapping fixture had590 characters, exceeding the candidate's documented500-character practice limit. Use354 characters, below that limit. Keep all content-retention and measured ink-margin assertions.
- Input rejection retained both prior text and layout and displayed a browser alert. The harness inspected only body.innerText, overlooking native dialogs. Capture and dismiss dialog messages, and validate the current rejection's message together with inline text. Keep oversized input and no-loss assertions.

These corrections do not close acceptance of the candidate. CSS world mapping, palm gaps, transformed input, small viewport and focused camera failures remain under independent investigation. Original reports stay unchanged. Revised checks run against the next frozen candidate.

October4: the prior active-resize case demanded continuation through x475, although its established pre-resize ink stopped at x400 and P0 explicitly permits safe stroke termination. Root reviewed and imported qa-agent/resize-acceptance-replacement.cjs: retained original RGBA, stationary/release no-ink, fresh-pointer recovery, plus actual DPR buffer reconstruction after changing current font/color/size. The fresh stage count is26; frozen comparison and earlier reports are untouched. qa-agent/RESIZE_HARNESS_REVISION.md explains the policy and limitations.

Round02 independent root result:26/26 passed, no page errors or external requests, qa/p0-round02/acceptance.json. Built source hashes remain those recorded in candidate-round02-source/manifest.json. Drawer transitions, pre-debounce geometry changes, rejected font loads, explicit blank-reference state, DPR1 mixed-font probes and real Huawei gates remain separate acceptance work.
