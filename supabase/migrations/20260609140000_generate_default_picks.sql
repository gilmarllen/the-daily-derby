-- generate_default_picks: ensure every player has an initial "No selection"
-- pick for the day two UTC days out. Run daily by a cron at 12:00 UTC, well
-- ahead of when that day becomes pickable (00:00 UTC the next day), so the
-- default rows always exist with a wide safety margin. Idempotent — re-running,
-- or a player who already picked, is left untouched via ON CONFLICT DO NOTHING.
--
-- A "No selection" pick is a picks row with null match_id / picked_side and the
-- default cost of 0, so we only need to supply user_id + match_day.

create or replace function public.generate_default_picks()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_match_day date := ((now() at time zone 'utc')::date + 2);
  v_count     integer;
begin
  insert into public.picks (user_id, match_day)
  select id, v_match_day
    from public.profiles
  on conflict (user_id, match_day) do nothing;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- Only the service role (the cron, via the admin client) may run the bulk insert.
grant execute on function public.generate_default_picks() to service_role;
