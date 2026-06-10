-- Make player_stats respect the caller's RLS instead of the view owner's.
-- A default (security definer) view bypasses RLS on the underlying tables, so
-- anyone could read every player's pick-derived stats. With security_invoker the
-- view runs as the querying role: picks RLS ("view own picks") then scopes the
-- aggregates to the caller, which is exactly what getCurrentPlayer needs.
--
-- Note: a future public leaderboard (everyone's trophies/streak) can't use this
-- invoker view directly — it'll need a SECURITY DEFINER function that returns
-- only the public aggregate columns for all players (never balance).

alter view public.player_stats set (security_invoker = on);
