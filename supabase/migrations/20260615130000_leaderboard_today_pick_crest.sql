-- Add the picked team's crest to the leaderboard's today pick, so the UI can
-- show a club crest next to the name (falling back to a default icon when the
-- team row has no crest_url yet). Like today_pick/today_result, this reflects
-- only today's locked pick (match_day = current_date).
drop function if exists public.get_leaderboard();

create or replace function public.get_leaderboard()
returns table (
  user_id uuid,
  username text,
  trophies integer,
  money_spent numeric,
  win_streak integer,
  today_pick text,
  today_result text,
  today_pick_crest text
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
    tp.today_result,
    tp.today_pick_crest
  from public.player_stats ps
  left join lateral (
    select
      case pk.picked_side
        when 'home' then m.home_team
        when 'away' then m.away_team
      end as today_pick,
      pk.result::text as today_result,
      case pk.picked_side
        when 'home' then ht.crest_url
        when 'away' then at.crest_url
      end as today_pick_crest
    from public.picks pk
    join public.matches m on m.id = pk.match_id
    left join public.teams ht on ht.id = m.home_team_id
    left join public.teams at on at.id = m.away_team_id
    where pk.user_id = ps.user_id
      and pk.match_day = current_date
    limit 1
  ) tp on true
  order by ps.trophies desc, ps.win_streak desc, ps.username asc;
$$;

grant execute on function public.get_leaderboard() to anon, authenticated;
