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
