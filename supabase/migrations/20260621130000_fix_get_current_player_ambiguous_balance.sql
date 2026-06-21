-- Fix get_current_player: the RETURNS TABLE out-columns (balance, username, ...)
-- are in scope as plpgsql variables, so the UPDATE's unqualified `balance + 4.00`
-- raised "column reference \"balance\" is ambiguous" at call time. Add
-- #variable_conflict use_column so unqualified refs resolve to the table column.
-- Body is otherwise identical to 20260621120000_get_current_player.sql.

create or replace function public.get_current_player()
returns table (
  username   text,
  balance    numeric(10, 2),
  trophies   integer,
  win_streak integer
)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
  v_user uuid := auth.uid();
  v_day  date := (now() at time zone 'utc')::date;
begin
  if v_user is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  -- Keep the update *relative* (balance + 4.00), same reasoning as
  -- apply_daily_income(): the expression is evaluated under the row lock, so it
  -- stays correct when it races set_daily_pick (which also writes balance).
  update public.profiles
     set balance = balance + 4.00,  -- daily income F$ 4.00
         last_income_on = v_day,
         updated_at = now()
   where id = v_user
     and last_income_on is distinct from v_day;

  -- The view already reflects the credit above (same transaction). Filtering to
  -- v_user means RLS on the underlying tables is irrelevant here.
  return query
    select ps.username, ps.balance, ps.trophies, ps.win_streak
      from public.player_stats ps
     where ps.user_id = v_user;
end;
$$;

grant execute on function public.get_current_player() to authenticated;
