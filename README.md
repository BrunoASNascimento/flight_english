# Flight English

English practice aboard a procedural de Havilland DH.98 Mosquito B Mk XVI.
Choose **prepositions** or **phrasal verbs**, with everyday and music-inspired
collections. The game includes 260 questions across CEFR-inspired A1–C1 practice
bands. These bands guide practice; they are not a certified proficiency assessment.

## Fly your way

- **Practice:** 20 questions, no countdown, no altitude penalties. Read the
  corrected sentence and explanation, then continue when ready.
- **Survival:** reach 37,000 ft from a starting altitude of 5,000 ft. Correct
  answers earn climb, streak and speed bonuses; wrong answers and timeouts cost
  750 ft. The aircraft descends between answers. Question time grows with
  reading length and level, from about 10 to 22 seconds.
- Choose a starting level and everyday, music-inspired or mixed questions.
- Every exercise shows the intended meaning to disambiguate context. Four
  curated options include every accepted alternative. Select any valid answer.
- Progress to the next band requires at least 8/10 recent correct answers,
  eight distinct correctly answered questions and three different patterns.
- Shuffled queues avoid repeats until a collection has been exhausted.

Corrections retain the original sentence and explain its answer. The timer and
altitude simulation stop during feedback. In Practice, continue manually; in
Survival, feedback continues after 2.8 seconds or when you press Next. Song
attribution is revealed after answering in Survival so titles cannot give away
the answer. Music-inspired questions are original exercises, not lyric playback.

### Emergencies

Survival incidents start after 25 seconds of active flight, recurring 30 seconds
after recovery. Feedback and pauses do not advance the flight clock.

| Incident          | Drain   | Recovery                                 | Reward   |
| ----------------- | ------- | ---------------------------------------- | -------- |
| Downdraft         | 95 ft/s | Two correct answers                      | 1,200 ft |
| Engine power loss | 80 ft/s | Three correct answers; progress retained | 1,600 ft |
| Wing icing        | 65 ft/s | Two consecutive correct answers          | 1,000 ft |

Synthetic British English callouts announce altitude thresholds and terrain
warnings, with visual captions. Browser/OS voice availability varies.

## Controls, sound and accessibility

- Tap/click an answer, or use **A–D / 1–4** when keyboard focus is outside controls.
- **Escape** pauses; **Enter / Space** continues feedback when focus is outside controls.
- Pause and hidden tabs stop simulation and audio. Returning to a hidden tab
  requires a deliberate Resume.
- Your supplied **Cleared for Takeoff — piano and violin** soundtrack plays during
  flights. Its 72-second WAV is delivered as a roughly 1.4 MB, 160 kbps MP3 with a
  soft ending and a playback crossfade. Gameplay does not wait for music loading.
- Separate music, engine, warning and voice volumes; master mute; playback retry
  if a browser blocks audio. Music ducks during warnings and spoken callouts.
- Low graphics removes settlements and reduces clouds; Medium reduces trees and
  clouds; High retains detailed scenery. Mobile pixel ratio is capped.
- Reduce scene motion stops terrain travel, propeller animation and aircraft sway.
  The OS preference is respected on a first visit; players can change it.
- Menus and question panels scroll when needed in compact portrait/landscape
  screens. Feedback is always available.

## Flight log and mistake review

Completed flights show accuracy, weak patterns and corrected answers. Review
missed questions in a finite, untimed session across levels. Later correct answers
remove questions from the saved-mistakes queue.

Preferences and the last 20 completed sessions are saved in this browser using a
versioned localStorage record (`flight-english.v1`). Each stored session retains at
most 300 attempts. No account or backend is required. Clearing browser storage
clears this progress. Storage failures do not prevent play. Ending an unfinished
flight from the pause menu returns to setup without saving an incomplete session.

## Development

Use **Node.js 24** and npm.

```sh
npm ci
npm run dev
```

Open <http://localhost:3000>.

```sh
npm run lint:prettier:check
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:browser
```

CI runs these checks, with browser scenarios for desktop, mobile portrait and
mobile landscape: full practice/debrief/review, grammar modes and preferences,
Survival timeouts, and soundtrack playback/pause/resume.

## Code organisation

- `game/engine.ts`: pure flight transitions, answer guards, timers and incidents.
- `game/training.ts`: question queues, reading time, progression and review helpers.
- `game/curriculum.ts`: editorial distractors and explanations by stable ID.
- `game/questions.ts`, `game/phrasal-verbs.ts`: question banks and alternatives.
- `game/audio.ts`: lifecycle, crossfade, ducking and resource disposal.
- `game/storage.ts`: version validation and bounded session persistence.
- `hooks/`: orchestration and browser progress subscriptions.
- `components/game/`: reusable menu, settings, question and debrief components.

When editing a question, update its editorial entry as well. Structural tests
cannot establish linguistic correctness; review the full completed sentence,
intended meaning and each distractor. Aircraft, scenery and textures are original
procedural interpretations rather than photogrammetry or a certified aircraft
model. Technology: Next.js, React, TypeScript, React Three Fiber, Three.js and
browser audio APIs.
