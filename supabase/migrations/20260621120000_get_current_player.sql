-- get_current_player: load the signed-in player's stats AND credit today's daily
-- income (F$ 4.00, see CLAUDE.md) in a single round-trip. Lets an authenticated
-- request top up the caller without waiting for the 00:00 UTC daily-income cron,
-- while keeping page loads at one DB call (the credit folds into the same RPC as
-- the stats read, instead of an extra query).
--
-- Scoped to auth.uid() (never a parameter) so a caller can only credit/read their
-- own row. The credit is idempotent + race-safe via last_income_on, exactly like
-- the all-players apply_daily_income(): the UPDATE only fires when not yet
-- credited today, and Postgres re-checks the WHERE on concurrently updated rows,
-- so racing the cron (or another request) can't double-credit.
--
-- SECURITY DEFINER: it reads the security_invoker player_stats view as the owner,
-- but every read is explicitly filtered to v_user, so no other player's data is
-- reachable. Returning the stats directly (vs. selecting the view from the app)
-- also avoids exposing last_income_on through the public, anon-granted view.

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
