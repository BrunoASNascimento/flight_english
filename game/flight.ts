export const CALLOUTS = [1000, 500, 400, 300, 200] as const;
export function crossedAltitudes(previous: number, current: number) {
  return CALLOUTS.filter((height) => previous > height && current <= height);
}
export type Incident = "downdraft" | "engine" | "icing";
export const INCIDENTS: Record<
  Incident,
  { title: string; instruction: string; drain: number }
> = {
  downdraft: {
    title: "SEVERE DOWNDRAFT",
    instruction: "Answer twice correctly to escape the sinking air.",
    drain: 95,
  },
  engine: {
    title: "PORT ENGINE POWER LOSS",
    instruction: "Answer twice correctly to restore engine power.",
    drain: 80,
  },
  icing: {
    title: "WING ICING",
    instruction: "Answer twice correctly to clear the ice.",
    drain: 65,
  },
};
