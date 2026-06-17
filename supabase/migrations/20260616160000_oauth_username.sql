-- Social login (OAuth) support: all new users now choose their username on a
-- post-login onboarding screen, so the new-user trigger no longer derives a
-- username from email/metadata. It assigns a guaranteed-unique placeholder and
-- flags the profile as needing a username; both email and OAuth signups follow
-- the same flow. `needs_username` is cleared by the setUsername server action.

alter table profiles
  add column needs_username boolean not null default false;

-- Existing players already have a real username — they don't need onboarding.
-- (The column default of false already covers them; this is just explicit.)

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Placeholder username derived from the user id (collision-free, satisfies
  -- the NOT NULL + UNIQUE constraint). The player replaces it on the
  -- /onboarding/username screen, which also clears needs_username.
  insert into public.profiles (id, username, needs_username)
  values (
    new.id,
    'player_' || left(replace(new.id::text, '-', ''), 12),
    true
  );

  -- Current picking day = the next UTC day. Profile row above satisfies the FK.
  insert into public.picks (user_id, match_day)
  values (new.id, ((now() at time zone 'utc')::date + 1))
  on conflict (user_id, match_day) do nothing;

  return new;
end;
$$;
