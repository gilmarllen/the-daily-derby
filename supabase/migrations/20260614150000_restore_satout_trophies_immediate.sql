-- Restore the sat-out (-2) trophy penalty, which 20260614120000 accidentally
-- dropped when it rebuilt player_stats from the pre-sat-out version. A sat-out
-- is a pick with match_id IS NULL; it has no match to settle, so settle_match
-- never sets its result and the result-based sum can never see it. It must be
-- counted directly.
--
-- It now counts as soon as the day is locked (match_day <= current_date), i.e.
-- the moment the daily reset moves it out of the editable pickable day
-- (current_date + 1) — not a day later. We key on match_id IS NULL (not result
-- IS NULL) so an unsettled *team* pick still counts as 0, never -2.
--
-- Other columns match 20260614120000: money_spent excludes the in-progress pick
-- (match_day <= current_date) and win_streak stays result-driven (sat-outs are
-- neutral, never breaking a streak).

drop view if exists player_stats;

create view player_stats as
select
  p.id as user_id,
  p.username,
  p.balance,
  (
    coalesce(pt.trophies, 0)
    + coalesce(ac.missions, 0)
    - 2 * coalesce(so.sat_out_days, 0)
  )::int as trophies,
  coalesce(ms.money_spent, 0)::numeric(10, 2) as money_spent,
  coalesce(st.win_streak, 0)::int as win_streak
from profiles p
left join (
  -- Settled team picks: win +3, draw 0, loss -1.
  select user_id,
    sum(case result
      when 'win'  then 3
      when 'draw' then 0
      when 'loss' then -1
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
  -- Locked sat-out days (no selection): -2 each. Locked = match_day <=
  -- current_date, so it counts the moment the day leaves the editable
  -- pickable day (current_date + 1).
  select user_id, count(*) as sat_out_days
  from picks
  where match_id is null
    and match_day <= current_date
  group by user_id
) so on so.user_id = p.id
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
