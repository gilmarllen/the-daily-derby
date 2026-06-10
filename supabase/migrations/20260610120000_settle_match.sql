-- settle_match: record a finished match's result/score and settle every team
-- pick on it. Called by the settle-matches cron once odds-api reports a final
-- score. Trophies + win streak are *derived* from picks (see the player_stats
-- view), so settlement only records results — it never mutates profiles.
--
-- Idempotent + race-safe: the match row is locked and only settled while still
-- 'scheduled'; picks are only settled while settled_at is null. A re-run (or a
-- concurrent run) is a no-op.
--
-- A match that ends in a draw makes a team pick a "draw", not a loss.

create or replace function public.settle_match(
  p_match_id   uuid,
  p_home_score integer,
  p_away_score integer
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_status  public.match_status;
  v_result  public.match_result;
  v_settled integer;
begin
  if p_home_score is null or p_away_score is null then
    raise exception 'Scores are required to settle a match' using errcode = '22023';
  end if;

  -- Lock the match; bail if it's already settled.
  select status into v_status from public.matches where id = p_match_id for update;
  if not found then
    raise exception 'Match % not found', p_match_id using errcode = 'P0002';
  end if;
  if v_status <> 'scheduled' then
    return 0;
  end if;

  v_result := case
    when p_home_score > p_away_score then 'home'
    when p_away_score > p_home_score then 'away'
    else 'draw'
  end;

  update public.matches
     set result = v_result,
         home_score = p_home_score,
         away_score = p_away_score,
         status = 'finished'
   where id = p_match_id;

  -- Settle each team pick on this match. Trophies/streak derive from result.
  update public.picks
     set result = case
           when picked_side = v_result then 'win'::public.pick_result
           when v_result = 'draw'      then 'draw'::public.pick_result
           else                              'loss'::public.pick_result
         end,
         settled_at = now()
   where match_id = p_match_id
     and picked_side is not null
     and settled_at is null;

  get diagnostics v_settled = row_count;
  return v_settled;
end;
$$;

grant execute on function public.settle_match(uuid, integer, integer) to service_role;
