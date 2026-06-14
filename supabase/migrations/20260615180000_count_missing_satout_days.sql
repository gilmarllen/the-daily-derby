-- Count days with no pick row as sat-outs in derived trophies. Previously only
-- explicit sat-out rows (match_id null) cost -2; a day the player skipped that
-- never got a default-pick row (e.g. a missed nightly job) cost nothing, so the
-- headline trophy total didn't match the profile's day-by-day history (which now
-- shows those gaps as sat-outs).
--
-- New rule: every locked day (match_day <= current_date) from the player's first
-- pick through today that has no *team* pick is a -2 no-selection day. Computed
-- as (span length) - (locked team-pick days), which covers both explicit sat-out
-- rows and missing days. Span starts at the first locked pick, so a brand-new
-- player with only a future in-progress pick is never penalised.
--
-- Only the sat-out subquery changes; trophies-from-results, money_spent and the
-- (deliberately neutral) win_streak are unchanged from 20260614150000.

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
  -- No-selection days (-2 each): every locked day from the player's first pick
  -- through today that lacks a team pick. (span length) - (locked team-pick
  -- days) counts both explicit sat-out rows (match_id null) and days with no
  -- pick row at all, so the total matches the profile's day-by-day history.
  -- One pick per day means the team-pick count can't exceed the span length.
  select
    user_id,
    (current_date - min(match_day) + 1)
      - count(*) filter (where match_id is not null) as sat_out_days
  from picks
  where match_day <= current_date
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
