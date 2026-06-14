-- Add team/league crests to get_player_picks so the profile page can show the
-- picked team's crest (like the signed-in player's own history does via
-- getPastPicks). The previous version returned names only, so other players'
-- profiles always fell back to the default shield icon.
--
-- Return shape changes (new OUT columns), so the function must be dropped first
-- — CREATE OR REPLACE cannot alter a function's result columns. Sat-out picks
-- (match_id null) are still included via the LEFT JOINs.
drop function if exists public.get_player_picks(text);

create or replace function public.get_player_picks(p_username text)
returns table (
  id           uuid,
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
  select
    pk.id,
    pk.match_day,
    pk.picked_side,
    pk.cost,
    pk.result,
    ht.name as home_team,
    at.name as away_team,
    l.name  as league,
    ht.crest_url as home_crest,
    at.crest_url as away_crest,
    l.crest_url  as league_crest
  from public.picks pk
  join public.profiles p on p.id = pk.user_id
  left join public.matches m on m.id = pk.match_id
  left join public.teams ht on ht.id = m.home_team_id
  left join public.teams at on at.id = m.away_team_id
  left join public.leagues l on l.id = m.league_id
  where p.username = p_username
    and pk.match_day <= current_date
  order by pk.match_day desc
  limit 30;
$$;

grant execute on function public.get_player_picks(text) to authenticated;
