-- Stop money_spent (and the leaderboard) from leaking the in-progress pick.
--
-- A pick for the pickable day (current_date + 1 UTC) is still being chosen:
-- its cost = 10 / odds, so surfacing it in money_spent reveals the odds and
-- narrows down which team a rival is backing. Recreate player_stats so
-- money_spent only counts *locked* picks (match_day <= current_date), and add a
-- locked today-pick column to the leaderboard so players can see each other's
-- picks for today (matches that have already kicked off).

drop view if exists player_stats;

-- Same as 20260610130000 / the missions rename, except money_spent excludes the
-- in-progress (pickable-day) pick. trophies + win_streak already only consider
-- settled picks (result is not null), so they never include it.
create view player_stats as
select
  p.id as user_id,
  p.username,
  p.balance,
  (coalesce(pt.trophies, 0) + coalesce(ac.missions, 0))::int as trophies,
  coalesce(ms.money_spent, 0)::numeric(10, 2) as money_spent,
  coalesce(st.win_streak, 0)::int as win_streak
from profiles p
left join (
  select user_id,
    sum(case result
      when 'win'  then 3
      when 'draw' then 0
      when 'loss' then -1
      when 'none' then -2
      else 0
    end) as trophies
  from picks
  where result is not null
  group by user_id
) pt on pt.user_id = p.id
left join (
  select user_id, count(*) as missions
  from user_missions
  group by user_id
) ac on ac.user_id = p.id
left join (
  -- Locked picks only: exclude the in-progress pick (match_day = current_date+1)
  -- so the staked amount can't leak the active selection's odds.
  select user_id, sum(cost) as money_spent
  from picks
  where match_day <= current_date
  group by user_id
) ms on ms.user_id = p.id
left join (
  -- Count wins more recent than the player's most recent loss (only a loss
  -- breaks the streak; draws and no-selection days are neutral, neither adding
  -- to nor resetting it). No loss yet → every win counts.
  select user_id,
    count(*) filter (
      where result = 'win' and (first_loss_rn is null or rn < first_loss_rn)
    ) as win_streak
  from (
    select user_id, result, rn,
      min(rn) filter (where result = 'loss') over (partition by user_id) as first_loss_rn
    from (
      select user_id, result,
        row_number() over (partition by user_id order by match_day desc) as rn
      from picks
      where result is not null
    ) ranked
  ) marked
  group by user_id
) st on st.user_id = p.id;

grant select on player_stats to anon, authenticated, service_role;

-- Recreate the leaderboard to surface each player's locked team pick for today
-- (match_day = current_date). That pick's match has already kicked off, so
-- showing the team can't leak an in-progress choice. Still never exposes balance.
-- Drop first: can't change a function's return type (added today_pick) with
-- CREATE OR REPLACE.
drop function if exists public.get_leaderboard();

create or replace function public.get_leaderboard()
returns table (
  user_id uuid,
  username text,
  trophies integer,
  money_spent numeric,
  win_streak integer,
  today_pick text
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
    tp.today_pick
  from public.player_stats ps
  left join lateral (
    select case pk.picked_side
             when 'home' then m.home_team
             when 'away' then m.away_team
           end as today_pick
    from public.picks pk
    join public.matches m on m.id = pk.match_id
    where pk.user_id = ps.user_id
      and pk.match_day = current_date
    limit 1
  ) tp on true
  order by ps.trophies desc, ps.win_streak desc, ps.username asc;
$$;

grant execute on function public.get_leaderboard() to anon, authenticated;
