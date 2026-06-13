-- Make teams/leagues the source of truth for match identity.
--
-- Phase 1 (20260615120000) added the teams/leagues catalogs + FKs as additive
-- lookups while matches kept the text columns. Those are now redundant, so this
-- migration drops matches.home_team / away_team / league and repoints the
-- name-reading SQL functions at the catalog joins.
--
-- It also adds teams.external_id (the odds-api homeId/awayId). The nightly sync
-- keys teams on that id when present, creating a new row on miss; existing rows
-- are NOT backfilled with an id here (done later, out of band). league stays
-- keyed by slug (the API exposes no league id).

-- 1. Team external id (odds-api). Nullable + unique; Postgres permits many NULLs
-- so the name-only rows keep coexisting.
alter table teams add column external_id text;
create unique index teams_external_id_key on teams (external_id);

-- 2. Name is no longer a unique identity: an id-keyed row and a name-keyed row
-- for the same club may coexist until reconciled by hand.
alter table teams drop constraint if exists teams_name_key;

-- 3. Repoint the name-reading functions at the catalog joins BEFORE dropping the
-- columns (a language-sql function still referencing m.home_team would block the
-- drop). Return shapes are unchanged.

-- get_leaderboard: today pick name + crest from the joined teams.
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
        when 'home' then ht.name
        when 'away' then at.name
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

-- get_player_profile: best league from the joined leagues catalog.
create or replace function public.get_player_profile(p_username text)
returns table (
  username           text,
  trophies           integer,
  win_streak         integer,
  money_spent        numeric,
  adjusted_balance   numeric,
  total_predictions  integer,
  wins               integer,
  win_rate           numeric,
  best_league        text,
  best_league_wins   integer
)
language sql
security definer
set search_path = ''
as $$
  with target as (
    select p.id, p.username, p.balance
    from public.profiles p
    where p.username = p_username
  ),
  settled as (
    -- Settled team picks only (sat-outs have match_id null and don't count as
    -- predictions). Joined to the league for the best-league breakdown.
    select pk.result, l.name as league
    from public.picks pk
    join target t on t.id = pk.user_id
    join public.matches m on m.id = pk.match_id
    left join public.leagues l on l.id = m.league_id
    where pk.result in ('win', 'draw', 'loss')
  ),
  league_rank as (
    select
      league,
      count(*) filter (where result = 'win') as wins,
      count(*) as plays
    from settled
    where league is not null
    group by league
    order by
      count(*) filter (where result = 'win') desc,
      (count(*) filter (where result = 'win'))::numeric / nullif(count(*), 0) desc,
      league asc
    limit 1
  )
  select
    t.username,
    st.trophies,
    st.win_streak,
    st.money_spent,
    -- Pre-pick balance: add back the in-progress pick's cost (if any).
    (t.balance + coalesce((
      select pk.cost from public.picks pk
      where pk.user_id = t.id and pk.match_day = current_date + 1
    ), 0))::numeric(10, 2) as adjusted_balance,
    (select count(*) from settled)::int as total_predictions,
    (select count(*) from settled where result = 'win')::int as wins,
    case when (select count(*) from settled) = 0 then 0
      else round(
        (select count(*) from settled where result = 'win')::numeric
        / (select count(*) from settled), 4)
    end as win_rate,
    (select league from league_rank) as best_league,
    coalesce((select wins from league_rank), 0)::int as best_league_wins
  from target t
  join public.player_stats st on st.user_id = t.id;
$$;

grant execute on function public.get_player_profile(text) to authenticated;

-- get_player_picks: team + league names from the joined catalogs.
create or replace function public.get_player_picks(p_username text)
returns table (
  id           uuid,
  match_day    date,
  picked_side  public.match_result,
  cost         numeric,
  result       public.pick_result,
  home_team    text,
  away_team    text,
  league       text
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
    l.name  as league
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

-- 4. Drop the now-redundant text columns. league_slug stays (the per-player
-- weighted draw reads it without a join).
alter table matches
  drop column home_team,
  drop column away_team,
  drop column league;
