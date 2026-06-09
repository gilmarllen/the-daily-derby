-- Extend the new-user trigger to also seed a default "No selection" pick for the
-- day the new player can pick for right now (the next UTC day). The daily
-- generate_default_picks cron only seeds existing players ahead of time, so a
-- mid-day signup would otherwise have no pick row for the current picking day —
-- this closes that gap.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1))
  );

  -- Current picking day = the next UTC day. Profile row above satisfies the FK.
  insert into public.picks (user_id, match_day)
  values (new.id, ((now() at time zone 'utc')::date + 1))
  on conflict (user_id, match_day) do nothing;

  return new;
end;
$$;
