-- Count sat-out (no-selection) days in derived trophies without settling them.
-- A sat-out is a pick with match_id IS NULL; once its day has fully passed
-- (match_day < today UTC) it costs -2 trophies. We deliberately key on
-- match_id IS NULL rather than result IS NULL: an unsettled *team* pick (match
-- not finished, or postponed and never resolved) also has result NULL but must
-- NOT be penalized — it just counts as 0 until/unless it settles.

create or replace view player_stats as
select
  p.id as user_id,
  p.username,
  p.balance,
  (
    coalesce(pt.trophies, 0)
    + coalesce(ac.achievements, 0)
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
  select user_id, count(*) as achievements
  from user_achievements
  group by user_id
) ac on ac.user_id = p.id
left join (
  -- Sat-out days whose day has fully passed: -2 each.
  select user_id, count(*) as sat_out_days
  from picks
  where match_id is null
    and match_day < (now() at time zone 'utc')::date
  group by user_id
) so on so.user_id = p.id
left join (
  select user_id, sum(cost) as money_spent
  from picks
  group by user_id
) ms on ms.user_id = p.id
left join (
  -- Wins since the most recent loss (only a loss breaks the streak; draws and
  -- no-selection days are neutral). No loss yet → every win counts.
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
