-- set_daily_pick: atomically set (or clear) the signed-in player's pick for the
-- current pickable day, adjusting their balance (refund the old pick, charge the
-- new one). Runs as SECURITY DEFINER so it can update profiles/picks while still
-- identifying the caller via auth.uid(); all validation is done here.
--
-- Validation / anti-tamper:
--   * the day is server-derived (the next UTC day), never trusted from input;
--   * a team pick must be one of the matches in the player's frozen daily_pools
--     row for that day;
--   * cost is computed from the matches table, not the client.
--
-- Concurrency: the player's profile row is locked (FOR UPDATE) before the
-- balance is read and written, so concurrent calls for the same user serialize
-- and can't lose updates or drive the balance negative.

create or replace function public.set_daily_pick(
  p_match_id uuid,
  p_side public.match_result
)
returns numeric
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user      uuid := auth.uid();
  v_match_day date := ((now() at time zone 'utc')::date + 1);
  v_balance   numeric(10, 2);
  v_old_cost  numeric(10, 2);
  v_new_cost  numeric(10, 2) := 0;
  v_odds      numeric(6, 2);
  v_pool_ids  uuid[];
begin
  if v_user is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  -- A pick is either a team (match + side) or No-selection (both null).
  if (p_match_id is null) <> (p_side is null) then
    raise exception 'Provide both a match and a side, or neither'
      using errcode = '22023';
  end if;

  if p_match_id is not null then
    if p_side not in ('home', 'away') then
      raise exception 'Pick side must be home or away' using errcode = '22023';
    end if;

    -- The match must be one of the player's 5 frozen matches for the day.
    select match_ids into v_pool_ids
      from public.daily_pools
     where user_id = v_user and match_day = v_match_day;

    if v_pool_ids is null or not (p_match_id = any (v_pool_ids)) then
      raise exception 'Match is not in your pool for the day'
        using errcode = '22023';
    end if;

    -- Cost is derived from the picked side's odds: 10 / odds.
    select case when p_side = 'home' then home_odds else away_odds end
      into v_odds
      from public.matches
     where id = p_match_id;

    if v_odds is null or v_odds <= 0 then
      raise exception 'Match odds unavailable' using errcode = '22023';
    end if;

    v_new_cost := round(10.0 / v_odds, 2);
  end if;

  -- Lock the player's row, then read the existing pick under that lock so the
  -- refund/charge is race-safe.
  select balance into v_balance
    from public.profiles
   where id = v_user
   for update;
  if not found then
    raise exception 'Profile not found' using errcode = 'P0002';
  end if;

  select cost into v_old_cost
    from public.picks
   where user_id = v_user and match_day = v_match_day;
  v_old_cost := coalesce(v_old_cost, 0);

  v_balance := v_balance + v_old_cost - v_new_cost;
  if v_balance < 0 then
    raise exception 'Insufficient balance for this pick' using errcode = '22023';
  end if;

  update public.profiles
     set balance = v_balance, updated_at = now()
   where id = v_user;

  insert into public.picks (user_id, match_day, match_id, picked_side, cost)
  values (v_user, v_match_day, p_match_id, p_side, v_new_cost)
  on conflict (user_id, match_day) do update
    set match_id    = excluded.match_id,
        picked_side = excluded.picked_side,
        cost        = excluded.cost;

  return v_balance;
end;
$$;

grant execute on function public.set_daily_pick(uuid, public.match_result)
  to authenticated;
