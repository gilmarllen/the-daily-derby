-- Public Storage bucket for team crests. The sync-team-crests cron downloads
-- odds-api participant logos and uploads them here, then writes the object's
-- public URL into teams.crest_url.
--
-- Public bucket: anyone can read objects and getPublicUrl returns a permanent,
-- directly-usable URL — no extra Storage RLS read policies needed. Uploads go
-- through the service-role admin client, which bypasses RLS.
insert into storage.buckets (id, name, public)
values ('team-crests', 'team-crests', true)
on conflict (id) do nothing;
