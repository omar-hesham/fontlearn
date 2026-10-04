# P2 Specifications & Assets Preparation

## 1. Clear Learn / Studio Onboarding
**Goal:** Provide an onboarding screen to choose between "Learn" (Structured lessons) and "Studio" (Free drawing).
- **UI:** A welcome modal overlay that appears if no progress is saved.
- **Choices:** 
  - Language: Arabic / English
  - Level: Beginner / Intermediate
- **Asset:** Needs an onboarding hero graphic (placeholder: `assets/onboarding_hero.svg`).

## 2. Lesson Packs Separation
**Goal:** Separate lesson logic from fonts.
- **Structure:**
  - `lessons/` directory containing JSON files for each pack.
  - A pack defines a sequence of lessons.
  - Each lesson MUST specify:
    - `text`: the string to draw
    - `font`: the target font
    - `requiredTool`: the tool mechanism forced for this lesson
    - `minPassingScore`: the threshold for completion
    - `goals` and `steps`: detailed instructional steps and objectives
    - `criteria`: what specific points to check (e.g. angle, width)
    - `source` and `review`: metadata marking origin and review status (e.g. "DRAFT")
    - `idealStrokes`: detailed trace paths containing X/Y coordinates, start/end boundaries, stroke order, and lift points.

## 3. 12 Starter Lessons
**Goal:** 6 Arabic + 6 English lessons with explicit review status.
**Arabic Pack (Beginner):**
1. Single Letter: "ب" (Status: DRAFT)
2. Single Letter: "ج" (Status: DRAFT)
3. Word: "حب" (Status: DRAFT)
4. Word: "باب" (Status: DRAFT)
5. Sentence: "بسم الله" (Status: DRAFT)
6. Sentence: "الحمد لله" (Status: DRAFT)

**English Pack (Beginner):**
1. Basic Stroke: "l" (Status: DRAFT)
2. Basic Stroke: "o" (Status: DRAFT)
3. Letter Connection: "lo" (Status: DRAFT)
4. Word: "calligraphy" (Status: DRAFT)
5. Capital Letter: "A" (Status: DRAFT)
6. Sentence: "Art is life" (Status: DRAFT)

## 4. Watchable Trace & Stroke Order
**Goal:** Provide a recorded perfect trace for the user to watch.
- **Data Structure:** Add an array of `idealStrokes` to each lesson JSON.
- **UI Controls:** Play, Pause, Slow (0.5x), Restart.
- **Logic:** Animate an SVG path or canvas strokes over time using `requestAnimationFrame`.

## 5. Learning Stages (Watch -> Trace -> Copy -> Recall)
**Goal:** Progressive fading of assistance.
1. **Watch:** User watches the animation.
2. **Trace:** Template is 100% visible (or 40% Ghost), user draws over it.
3. **Copy:** Template is shown above the drawing area, user draws on a blank grid below.
4. **Recall:** Template flashes for 3 seconds then disappears; user draws from memory.

## 6. Offline Support & Persistence
**Goal:** Work entirely offline and save progress.
- **Mechanism:** Use Capacitor's local storage or IndexedDB (via localForage) to store `currentLessonId`, `packProgress`, and `lastValidState`.
- **Offline Assets:** Ensure all fonts and lesson JSONs are bundled locally, not fetched via CDN.
