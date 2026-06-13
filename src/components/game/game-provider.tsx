"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

import { useDictionary } from "@/components/i18n/locale-provider";
import { useToastManager } from "@/components/ui/toast";
import { setPick } from "@/lib/game/actions";
import { costFromOdds } from "@/lib/game/constants";
import type { Match, Player, Selection, TeamOption } from "@/lib/game/types";
import { utcDayStart } from "@/lib/time";

/** The next 00:00 UTC reset, formatted in the viewer's local timezone. */
function localResetTime(): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(utcDayStart(new Date(), 1));
}

/**
 * Refreshes the route (re-running the server loaders behind the game state) when
 * the tab regains focus or becomes visible, so a returning player sees the
 * current balance / pick / pool. Throttled, and paused via `isPaused` while a
 * pick is mid-flight so it can't clobber an optimistic update.
 */
function useRevalidateOnFocus(
  isPaused: React.RefObject<boolean>,
  throttleMs = 2000
) {
  const router = useRouter();

  useEffect(() => {
    let last = 0;
    const revalidate = () => {
      if (isPaused.current) return;
      if (document.visibilityState === "hidden") return;
      const now = Date.now();
      if (now - last < throttleMs) return;
      last = now;
      router.refresh();
    };

    window.addEventListener("focus", revalidate);
    document.addEventListener("visibilitychange", revalidate);
    return () => {
      window.removeEventListener("focus", revalidate);
      document.removeEventListener("visibilitychange", revalidate);
    };
  }, [router, isPaused, throttleMs]);
}

function selectionKey(selection: Selection): string {
  return selection.kind === "team" ? selection.optionId : "none";
}

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
  /** True while a pick change is being persisted. */
  pending: boolean;
  /** Last error from persisting a pick, if any. */
  error: string | null;
  /** Jump to the Pick page and flash the current selection. */
  requestHighlight: () => void;
  /** Bumped on each highlight request, so the Pick page can react. */
  highlightSignal: number;
  /** Returns true once per request; the Pick page calls it to claim a flash. */
  consumeHighlight: () => boolean;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({
  player,
  matches,
  initialSelection,
  children,
}: {
  player: Player;
  matches: Match[];
  initialSelection: Selection;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToastManager();
  const t = useDictionary().selection;
  const [selection, setSelection] = useState<Selection>(initialSelection);
  // Balance changes as picks are made/changed; the header reads it from here.
  const [balance, setBalance] = useState(player.balance);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Lets the in-progress banner send the player to the Pick page and flash
  // their current selection. The flag survives cross-page navigation because
  // this provider lives in the dashboard layout; the signal re-fires the flash
  // when the Pick page is already mounted.
  const highlightPendingRef = useRef(false);
  const [highlightSignal, setHighlightSignal] = useState(0);
  const requestHighlight = useCallback(() => {
    highlightPendingRef.current = true;
    setHighlightSignal((n) => n + 1);
    if (pathname !== "/dashboard") {
      router.push("/dashboard");
    }
  }, [pathname, router]);
  const consumeHighlight = useCallback(() => {
    if (!highlightPendingRef.current) return false;
    highlightPendingRef.current = false;
    return true;
  }, []);

  // Revalidate the server state when the tab regains focus, but never while a
  // pick is being persisted.
  const pendingRef = useRef(pending);
  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);
  useRevalidateOnFocus(pendingRef);

  // When a focus revalidation delivers fresh server props, adopt them. We track
  // the last server snapshot we synced; a change means new data arrived (rather
  // than a local re-render), so the persisted balance + pick become the truth.
  const [serverSnapshot, setServerSnapshot] = useState({
    key: selectionKey(initialSelection),
    balance: player.balance,
  });
  const incomingKey = selectionKey(initialSelection);
  if (
    incomingKey !== serverSnapshot.key ||
    player.balance !== serverSnapshot.balance
  ) {
    setServerSnapshot({ key: incomingKey, balance: player.balance });
    setSelection(initialSelection);
    setBalance(player.balance);
  }

  const allOptions = useMemo(
    () => matches.flatMap((m) => [m.home, m.away]),
    [matches]
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

  // Switching picks refunds the current one first, so the spendable amount is
  // the balance plus whatever the current pick cost.
  const canAfford = useCallback(
    (option: TeamOption) => costFromOdds(option.odds) <= balance + selectedCost,
    [balance, selectedCost]
  );

  // Persist a selection change optimistically, reconciling with the balance the
  // server returns (authoritative) and rolling back on failure.
  const commit = useCallback(
    (
      next: Selection,
      input: Parameters<typeof setPick>[0],
      optimisticBalance: number,
      savedTitle: string
    ) => {
      const prevSelection = selection;
      const prevBalance = balance;

      setError(null);
      setSelection(next);
      setBalance(optimisticBalance);

      startTransition(async () => {
        const result = await setPick(input);
        if ("error" in result) {
          setSelection(prevSelection);
          setBalance(prevBalance);
          setError(result.error);
        } else {
          setBalance(result.balance);
          // Confirm the save, and remind the player picks stay editable until
          // the daily reset (shown in their local time).
          toast.add({
            title: savedTitle,
            description: t.savedDesc(localResetTime()),
          });
        }
      });
    },
    [selection, balance, toast, t]
  );

  const pickTeam = useCallback(
    (optionId: string) => {
      const option = allOptions.find((o) => o.id === optionId);
      if (
        !option ||
        (selection.kind === "team" && selection.optionId === optionId)
      ) {
        return;
      }
      const optimisticBalance =
        balance + selectedCost - costFromOdds(option.odds);
      commit(
        { kind: "team", optionId },
        { matchId: option.matchId, side: option.side },
        optimisticBalance,
        t.savedTitle
      );
    },
    [allOptions, selection, balance, selectedCost, commit, t]
  );

  const clearPick = useCallback(() => {
    if (selection.kind === "none") return;
    commit(
      { kind: "none" },
      { matchId: null, side: null },
      balance + selectedCost,
      t.clearedTitle
    );
  }, [selection, balance, selectedCost, commit, t]);

  const value: GameContextValue = {
    player: { ...player, balance },
    matches,
    selection,
    selectedOption,
    selectedCost,
    isSelected,
    canAfford,
    pickTeam,
    clearPick,
    pending,
    error,
    requestHighlight,
    highlightSignal,
    consumeHighlight,
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
