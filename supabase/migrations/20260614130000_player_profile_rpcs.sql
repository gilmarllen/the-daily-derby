-- Public profile RPCs: let a logged-in player view another player's profile.
-- picks RLS is owner-only, so (like get_leaderboard) these are SECURITY DEFINER
-- and expose only safe, locked data. Two privacy rules enforced here:
--   * in-progress pick (match_day = current_date + 1) is never reflected — not
--     in money_spent (the view already excludes it), not in the picks list, and
--     adjusted_balance adds its cost back so the spend can't be inferred.
--   * only locked picks (match_day <= current_date) are returned.
-- Granted to authenticated only — viewing profiles is a logged-in feature.

-- Scalar stats for a single player, looked up by username.
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
    select pk.result, m.league
    from public.picks pk
    join target t on t.id = pk.user_id
    join public.matches m on m.id = pk.match_id
    where pk.result in ('win', 'draw', 'loss')
  ),
  league_rank as (
    select
      league,
      count(*) filter (where result = 'win') as wins,
      count(*) as plays
    from settled
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

-- Locked past picks for a player (newest first), mirroring getPastPicks' shape.
-- Excludes the in-progress pick via match_day <= current_date.
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
    m.home_team,
    m.away_team,
    m.league
  from public.picks pk
  join public.profiles p on p.id = pk.user_id
  left join public.matches m on m.id = pk.match_id
  where p.username = p_username
    and pk.match_day <= current_date
  order by pk.match_day desc
  limit 30;
$$;

grant execute on function public.get_player_picks(text) to authenticated;
