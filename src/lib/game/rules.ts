// Shared rule data for the game guide and the welcome modal. Numbers come from
// `constants.ts` so the docs can never drift from behaviour; the human-readable
// titles/details live in the i18n dictionaries (`dict.scoring` / `dict.dailyLoop`)
// keyed by the stable ids below.

import { TROPHY_DELTAS } from "./constants";
import type { Dictionary } from "@/lib/i18n/dictionary";

export type ScoringId = keyof Dictionary["scoring"];

export type ScoringRule = {
  id: ScoringId;
  trophies: number;
};

/** The trophy delta table, in the order players should read it. */
export const SCORING_RULES: ScoringRule[] = [
  { id: "win", trophies: TROPHY_DELTAS.win },
  { id: "draw", trophies: TROPHY_DELTAS.draw },
  { id: "loss", trophies: TROPHY_DELTAS.loss },
  { id: "none", trophies: TROPHY_DELTAS.none },
  { id: "mission", trophies: TROPHY_DELTAS.mission },
];

export type LoopId = keyof Dictionary["dailyLoop"];

/** The once-a-day game loop, start to finish. */
export const DAILY_LOOP: LoopId[] = [
  "getMatches",
  "makePick",
  "payPrice",
  "matchesPlay",
  "resetRepeat",
];
