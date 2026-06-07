-- Restore the table privileges Supabase normally grants by default. Without
-- these GRANTs, the API roles get "permission denied" (42501) even though RLS
-- policies exist — RLS filters rows, but the role still needs base privileges.
-- Row access stays governed by the RLS policies defined in the initial schema.

grant usage on schema public to anon, authenticated, service_role;

grant all on table public.profiles to anon, authenticated, service_role;
grant all on table public.matches to anon, authenticated, service_role;
grant all on table public.picks to anon, authenticated, service_role;
grant all on table public.achievements to anon, authenticated, service_role;
grant all on table public.user_achievements to anon, authenticated, service_role;

-- Future tables created by the migration role inherit the same grants.
alter default privileges in schema public
  grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on sequences to anon, authenticated, service_role;
