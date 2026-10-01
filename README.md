# Flight English

A desktop browser game that turns English preposition practice into a climb aboard a de Havilland DH.98 Mosquito B Mk XVI.

Correct answers make the aircraft climb. Wrong answers and expired timers reduce altitude. Difficulty advances from CEFR A1 to C1, and the mission is complete at the aircraft's 37,000 ft service ceiling.

## Prototype features

- Procedural 3D third-person Mosquito silhouette
- Dynamic sky, clouds and altitude feedback
- Twenty preposition questions from A1 to C1
- Streak, speed bonus, accuracy and altitude systems
- Synthesised engine sound with altitude-reactive pitch
- Victory at 37,000 ft and game over at 0 ft
- Desktop-first interface

The procedural aircraft and synthesised audio are placeholders. Production models, textures and recordings must be added only with an appropriate reuse licence.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verify

```bash
npm run lint
npm run build
```

## Technology

Next.js, React, TypeScript, React Three Fiber, Three.js and Web Audio.

## Emergency flight update

The aircraft geometry now uses tapered wings, a shaped fuselage, bomber glazing,
framed canopy, extended nacelles, three-blade propellers and RAF wing roundels.
This is an original procedural interpretation, not a scanned or certified model.

Flights lose height continuously. Downdraft, engine power loss and wing icing
start after 25 seconds, then recur 30 seconds after recovery. Two correct answers
resolve an incident and award 1,000 ft. Wrong answers cause a smooth descent
rather than an instant altitude jump. Terrain moves underneath the aircraft.

Modern-style callouts announce One Thousand, Five Hundred, Four Hundred, Three
Hundred and Two Hundred when descending through those heights. Below 200 ft,
Terrain / Pull up repeats. These are browser speech synthesis, not recordings
from an airliner; the voice depends on the installed browser/OS voices. Captions
remain available when muted. Pause and automatic tab-hiding pause stop gameplay.

Run the callout regression tests with Node 22.6+:

```sh
node --experimental-strip-types --test tests/flight.test.mjs
```
