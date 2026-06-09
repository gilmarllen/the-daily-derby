-- apply_daily_income: credit every player their daily income (F$ 4.00, see
-- CLAUDE.md) once per UTC day. Run by a cron at 00:00 UTC.
--
-- Idempotent + race-safe: last_income_on records the day a player was last
-- credited, and the UPDATE only touches players not yet credited today. Postgres
-- re-checks the WHERE on concurrently-updated rows, so a double-fire can't
-- double-credit.

alter table profiles
  add column last_income_on date;

create or replace function public.apply_daily_income()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_day   date := (now() at time zone 'utc')::date;
  v_count integer;
begin
  -- IMPORTANT: keep the balance update *relative* (balance + 4.00) rather than
  -- reading it into a variable and writing an absolute value. The relative
  -- expression is evaluated against the row under the UPDATE's lock, so it stays
  -- correct when it races set_daily_pick (which also writes profiles.balance):
  -- if a pick commits first, Postgres re-evaluates this against the new balance.
  -- An absolute read-then-write here would need its own SELECT ... FOR UPDATE to
  -- avoid a lost update.
  update public.profiles
     set balance = balance + 4.00,  -- daily income F$ 4.00
         last_income_on = v_day,
         updated_at = now()
   where last_income_on is distinct from v_day;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

grant execute on function public.apply_daily_income() to service_role;
