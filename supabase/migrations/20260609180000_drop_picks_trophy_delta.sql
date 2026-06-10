-- picks.trophy_delta is redundant: the trophy change is derivable from the pick
-- result (win +3, draw 0, loss -1, no selection -2; see TROPHY_DELTAS / CLAUDE.md).
-- Settlement records `result`; the UI derives the delta from it. Drop the column.
--
-- Trade-off: this removes the per-pick audit of what was actually awarded, so if
-- the trophy values ever change, historical picks would restate. Re-add the
-- column if auditable/variable scoring is needed later.

alter table picks drop column trophy_delta;
