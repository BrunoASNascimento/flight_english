export type Level = "A1" | "A2" | "B1" | "B2" | "C1";
export type Question = { id: string; sentence: string; answers: string[]; level: Level; hint: string };
export const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1"];

export const QUESTIONS: Question[] = [
  { id: "a1-1", sentence: "The crew are ___ the aircraft.", answers: ["in", "inside"], level: "A1", hint: "place" },
  { id: "a1-2", sentence: "We arrive ___ the airfield at noon.", answers: ["at"], level: "A1", hint: "specific place" },
  { id: "a1-3", sentence: "The map is ___ the table.", answers: ["on"], level: "A1", hint: "surface" },
  { id: "a1-4", sentence: "The hangar is ___ the control tower.", answers: ["behind"], level: "A1", hint: "position" },
  { id: "a2-1", sentence: "The Mosquito flew ___ the Channel.", answers: ["across", "over"], level: "A2", hint: "movement from one side to another" },
  { id: "a2-2", sentence: "The pilot climbed ___ the cockpit.", answers: ["into"], level: "A2", hint: "movement to the inside" },
  { id: "a2-3", sentence: "The aircraft passed ___ the clouds.", answers: ["through"], level: "A2", hint: "movement inside and out" },
  { id: "a2-4", sentence: "They have been airborne ___ six o'clock.", answers: ["since"], level: "A2", hint: "starting point in time" },
  { id: "b1-1", sentence: "The navigator is responsible ___ the route.", answers: ["for"], level: "B1", hint: "dependent preposition" },
  { id: "b1-2", sentence: "The mission was cancelled ___ the bad weather.", answers: ["because of", "due to"], level: "B1", hint: "reason" },
  { id: "b1-3", sentence: "The aircraft is capable ___ flying at high altitude.", answers: ["of"], level: "B1", hint: "dependent preposition" },
  { id: "b1-4", sentence: "Keep the runway lights ___ sight.", answers: ["in"], level: "B1", hint: "fixed expression" },
  { id: "b2-1", sentence: "The crew persisted ___ spite of the turbulence.", answers: ["in"], level: "B2", hint: "fixed expression" },
  { id: "b2-2", sentence: "The pilot was praised ___ remaining calm.", answers: ["for"], level: "B2", hint: "reason for praise" },
  { id: "b2-3", sentence: "The delay was attributed ___ an electrical fault.", answers: ["to"], level: "B2", hint: "dependent preposition" },
  { id: "b2-4", sentence: "Visibility deteriorated ___ the course of the flight.", answers: ["over", "during"], level: "B2", hint: "period of time" },
  { id: "c1-1", sentence: "The sortie proceeded ___ accordance with the revised orders.", answers: ["in"], level: "C1", hint: "formal fixed expression" },
  { id: "c1-2", sentence: "The outcome was contingent ___ favourable weather.", answers: ["on", "upon"], level: "C1", hint: "dependent preposition" },
  { id: "c1-3", sentence: "The crew acted ___ the assumption that the runway was clear.", answers: ["on"], level: "C1", hint: "formal collocation" },
  { id: "c1-4", sentence: "The reading was at variance ___ the earlier forecast.", answers: ["with"], level: "C1", hint: "formal fixed expression" }
];

export function levelForStreak(correctAnswers: number): Level {
  return LEVELS[Math.min(Math.floor(correctAnswers / 4), LEVELS.length - 1)];
}

export function pickQuestion(level: Level, previousId?: string): Question {
  const pool = QUESTIONS.filter((question) => question.level === level && question.id !== previousId);
  return pool[Math.floor(Math.random() * pool.length)] ?? QUESTIONS[0];
}
