-- Add the settled result of each player's today pick to the leaderboard so the
-- UI can colour it (win/draw/loss). null = not settled yet (pending). Like the
-- team name, this only reflects today's locked pick (match_day = current_date),
-- never the in-progress one.
drop function if exists public.get_leaderboard();

create or replace function public.get_leaderboard()
returns table (
  user_id uuid,
  username text,
  trophies integer,
  money_spent numeric,
  win_streak integer,
  today_pick text,
  today_result text
)
language sql
security definer
set search_path = ''
as $$
  select
    ps.user_id,
    ps.username,
    ps.trophies,
    ps.money_spent,
    ps.win_streak,
    tp.today_pick,
    tp.today_result
  from public.player_stats ps
  left join lateral (
    select
      case pk.picked_side
        when 'home' then m.home_team
        when 'away' then m.away_team
      end as today_pick,
      pk.result::text as today_result
    from public.picks pk
    join public.matches m on m.id = pk.match_id
    where pk.user_id = ps.user_id
      and pk.match_day = current_date
    limit 1
  ) tp on true
  order by ps.trophies desc, ps.win_streak desc, ps.username asc;
$$;

grant execute on function public.get_leaderboard() to anon, authenticated;
