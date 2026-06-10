-- Derive trophies + win streak from picks instead of storing them on profiles.
-- The leaderboard already needs money_spent = SUM(picks.cost) (only derivable),
-- so these fold into the same aggregation. This makes settlement a pure record
-- of results (no profiles mutation, no double-credit risk). balance stays a real
-- column — it's genuinely mutable (daily income + pick costs).

drop view if exists player_stats;

alter table profiles drop column trophies;
alter table profiles drop column win_streak;

-- Aggregated, leaderboard-ready player stats. A plain (security-definer) view so
-- it can aggregate every player's picks for the public leaderboard; it exposes
-- only aggregates (trophies / money spent / streak), never individual picks.
--
--   trophies   = sum of settled pick result deltas (win +3, draw 0, loss -1,
--                no selection -2) + 1 per earned achievement.
--   win_streak = wins since the most recent loss. Only a loss breaks the streak;
--                draws and sat-out (no selection) days are neutral.
--   money_spent = total staked across all picks.
create view player_stats as
select
  p.id as user_id,
  p.username,
  p.balance,
  (coalesce(pt.trophies, 0) + coalesce(ac.achievements, 0))::int as trophies,
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
  select user_id, count(*) as achievements
  from user_achievements
  group by user_id
) ac on ac.user_id = p.id
left join (
  select user_id, sum(cost) as money_spent
  from picks
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
