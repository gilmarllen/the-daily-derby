"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { costFromOdds } from "@/lib/game/constants";
import { matches } from "@/lib/game/mock-data";
import type { Match, Player, Selection, TeamOption } from "@/lib/game/types";

type GameContextValue = {
  player: Player;
  matches: Match[];
  selection: Selection;
  selectedOption: TeamOption | null;
  selectedCost: number;
  isSelected: (optionId: string) => boolean;
  canAfford: (option: TeamOption) => boolean;
  pickTeam: (optionId: string) => void;
  clearPick: () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({
  player,
  children,
}: {
  player: Player;
  children: React.ReactNode;
}) {
  // Single pick per day — defaults to "no selection".
  const [selection, setSelection] = useState<Selection>({ kind: "none" });

  const allOptions = useMemo(
    () => matches.flatMap((m) => [m.home, m.away]),
    []
  );

  const selectedOption =
    selection.kind === "team"
      ? (allOptions.find((o) => o.id === selection.optionId) ?? null)
      : null;

  const selectedCost = selectedOption ? costFromOdds(selectedOption.odds) : 0;

  const isSelected = useCallback(
    (optionId: string) =>
      selection.kind === "team" && selection.optionId === optionId,
    [selection]
  );

  const canAfford = useCallback(
    (option: TeamOption) => costFromOdds(option.odds) <= player.balance,
    [player.balance]
  );

  const pickTeam = useCallback(
    (optionId: string) => setSelection({ kind: "team", optionId }),
    []
  );

  const clearPick = useCallback(() => setSelection({ kind: "none" }), []);

  const value: GameContextValue = {
    player,
    matches,
    selection,
    selectedOption,
    selectedCost,
    isSelected,
    canAfford,
    pickTeam,
    clearPick,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return ctx;
}
