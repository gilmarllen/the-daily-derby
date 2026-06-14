-- Show days with no pick row at all as sat-outs on the player profile. The
-- daily default-pick job normally writes a sat-out (match_id null) for every
-- missed day, but historical gaps (days before the job, or runs it missed) left
-- holes in a player's history. Fill them by generating a continuous day series
-- from the player's first pick to today and left-joining the real picks; a day
-- with no row surfaces as a synthetic sat-out (null team -> the app maps it to a
-- no-selection row, like a real sat-out).
--
-- Scope is display only: player_stats still derives trophies from actual rows,
-- so a fully-missing day is shown as -2 but not counted in the headline total
-- (matching today's behaviour).
--
-- id becomes text so synthetic days (which have no picks.id) get a stable key.
drop function if exists public.get_player_picks(text);

create or replace function public.get_player_picks(p_username text)
returns table (
  id           text,
  match_day    date,
  picked_side  public.match_result,
  cost         numeric,
  result       public.pick_result,
  home_team    text,
  away_team    text,
  league       text,
  home_crest   text,
  away_crest   text,
  league_crest text
)
language sql
security definer
set search_path = ''
as $$
  with player as (
    select id from public.profiles where username = p_username
  ),
  -- One row per day from the player's first pick through today. When the player
  -- has no picks at all, min() is null and generate_series yields no rows.
  span as (
    select generate_series(
      (
        select min(pk.match_day)
        from public.picks pk
        join player on player.id = pk.user_id
      ),
      current_date,
      interval '1 day'
    )::date as match_day
  )
  select
    coalesce(pk.id::text, 'satout-' || s.match_day) as id,
    s.match_day,
    pk.picked_side,
    coalesce(pk.cost, 0) as cost,
    pk.result,
    ht.name as home_team,
    at.name as away_team,
    l.name  as league,
    ht.crest_url as home_crest,
    at.crest_url as away_crest,
    l.crest_url  as league_crest
  from span s
  cross join player
  left join public.picks pk
    on pk.user_id = player.id and pk.match_day = s.match_day
  left join public.matches m on m.id = pk.match_id
  left join public.teams ht on ht.id = m.home_team_id
  left join public.teams at on at.id = m.away_team_id
  left join public.leagues l on l.id = m.league_id
  order by s.match_day desc
  limit 30;
$$;

grant execute on function public.get_player_picks(text) to authenticated;
