// Shared, human-readable rule data for the game guide and the welcome modal.
// Numbers come from `constants.ts` so the docs can never drift from behaviour.

import { TROPHY_DELTAS } from "./constants";

export type ScoringRule = {
  outcome: string;
  trophies: number;
  detail: string;
};

/** The trophy delta table, in the order players should read it. */
export const SCORING_RULES: ScoringRule[] = [
  {
    outcome: "Win",
    trophies: TROPHY_DELTAS.win,
    detail: "Your picked team won its match.",
  },
  {
    outcome: "Draw",
    trophies: TROPHY_DELTAS.draw,
    detail: "The match ended level — no harm, no reward.",
  },
  {
    outcome: "Loss",
    trophies: TROPHY_DELTAS.loss,
    detail: "Your team lost. Only a loss breaks your win streak.",
  },
  {
    outcome: "No selection",
    trophies: TROPHY_DELTAS.none,
    detail: "You sat the day out and made no pick.",
  },
  {
    outcome: "New mission",
    trophies: TROPHY_DELTAS.mission,
    detail: "Bonus trophy each time you complete a mission.",
  },
];

export type LoopStep = {
  title: string;
  detail: string;
};

/** The once-a-day game loop, start to finish. */
export const DAILY_LOOP: LoopStep[] = [
  {
    title: "Get your matches",
    detail:
      "Each day you're dealt five real upcoming matches, drawn just for you from the global pool.",
  },
  {
    title: "Make one pick",
    detail:
      "Choose a single team you think will win — or sit the day out with No selection. You can change it freely until the daily lock.",
  },
  {
    title: "Pay the price",
    detail:
      "Each team costs F$ based on its odds (cheaper teams are bigger favourites). The cost leaves your balance when you pick.",
  },
  {
    title: "Matches play out",
    detail:
      "After kickoff, results settle automatically and your trophies move by the outcome.",
  },
  {
    title: "Reset & repeat",
    detail:
      "At the daily reset you get fresh matches, your income tops up your balance, and a new round begins.",
  },
];
