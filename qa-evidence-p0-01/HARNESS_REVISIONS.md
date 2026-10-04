# Independent harness revisions

The immutable p0-round01 result was 17/25. Two failures were caused by the harness, rather than demonstrated app defects:

- English wrapping fixture had590 characters, exceeding the candidate's documented500-character practice limit. Use354 characters, below that limit. Keep all content-retention and measured ink-margin assertions.
- Input rejection retained both prior text and layout and displayed a browser alert. The harness inspected only body.innerText, overlooking native dialogs. Capture and dismiss dialog messages, and validate the current rejection's message together with inline text. Keep oversized input and no-loss assertions.

These corrections do not close acceptance of the candidate. CSS world mapping, palm gaps, transformed input, small viewport and focused camera failures remain under independent investigation. Original reports stay unchanged. Revised checks run against the next frozen candidate.
