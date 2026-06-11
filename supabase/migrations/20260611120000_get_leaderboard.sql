-- Public leaderboard: every player's ranked stats. player_stats is a
-- security_invoker view (own row only), so the leaderboard needs a SECURITY
-- DEFINER function to read across all players. It returns only the public
-- aggregate columns — never balance — ordered for ranking.

create or replace function public.get_leaderboard()
returns table (
  user_id uuid,
  username text,
  trophies integer,
  money_spent numeric,
  win_streak integer
)
language sql
security definer
set search_path = ''
as $$
  select user_id, username, trophies, money_spent, win_streak
  from public.player_stats
  order by trophies desc, win_streak desc, username asc;
$$;

grant execute on function public.get_leaderboard() to anon, authenticated;
