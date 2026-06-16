-- Drop leagues.crest_url and leagues.primary_color. League crests/colours were
-- never surfaced in the UI, so the columns (and the league_crest field the
-- get_player_picks RPC derived from crest_url) are dead. Team crests/colours
-- stay; only the leagues catalog loses them.
--
-- get_player_picks is redefined first to drop the league_crest return column;
-- the leagues join is kept for the league *name*.

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
  away_crest   text
)
language sql
security definer
set search_path = ''
as $$
  with player as (
    select id from public.profiles where username = p_username
  ),
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
    at.crest_url as away_crest
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

alter table leagues
  drop column crest_url,
  drop column primary_color;
