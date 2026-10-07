export const CALLOUTS = [1000, 500, 400, 300, 200] as const;
export function crossedAltitudes(previous: number, current: number) {
  return CALLOUTS.filter((height) => previous > height && current <= height);
}
export type Incident = "downdraft" | "engine" | "icing";
export const INCIDENTS: Record<
  Incident,
  {
    title: string;
    instruction: string;
    drain: number;
    required: number;
    reward: number;
  }
> = {
  downdraft: {
    title: "SEVERE DOWNDRAFT",
    instruction: "Answer twice correctly to escape the sinking air.",
    drain: 95,
    required: 2,
    reward: 1200,
  },
  engine: {
    title: "PORT ENGINE POWER LOSS",
    instruction:
      "Make three successful repairs with correct answers. Progress is retained.",
    drain: 80,
    required: 3,
    reward: 1600,
  },
  icing: {
    title: "WING ICING",
    instruction: "Answer twice correctly in a row to clear the ice.",
    drain: 65,
    required: 2,
    reward: 1000,
  },
};
