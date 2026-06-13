-- Teams + leagues catalogs, so the UI can show club crests/colours and league
-- crests. The odds API gives reliable team *names* and league *slugs* but no
-- logos/colours, so these tables are auto-populated (names/slugs) by the nightly
-- sync and the crest_url / *_color columns are filled in by hand over time.
--
-- The matches text columns (home_team, away_team, league, league_slug) stay the
-- display source of truth; the new FKs are purely additive lookups for crest +
-- colour. All three FKs are nullable so legacy rows, sync gaps, or unmapped
-- leagues simply fall back to a default icon.

-- ---------------------------------------------------------------------------
-- leagues: keyed by the odds-api slug (stable).
-- ---------------------------------------------------------------------------
create table leagues (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  crest_url     text,
  primary_color text,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- teams: keyed by name. The odds-api team ids are optional/unreliable, so the
-- name is the natural join key.
-- ---------------------------------------------------------------------------
create table teams (
  id              uuid primary key default gen_random_uuid(),
  name            text not null unique,
  crest_url       text,
  primary_color   text,
  secondary_color text,
  created_at      timestamptz not null default now()
);

-- Additive FKs on matches. Constraints are named explicitly so PostgREST can
-- disambiguate the two FKs to `teams` in embedded selects.
alter table matches
  add column home_team_id uuid,
  add column away_team_id uuid,
  add column league_id    uuid,
  add constraint matches_home_team_id_fkey
    foreign key (home_team_id) references teams (id) on delete set null,
  add constraint matches_away_team_id_fkey
    foreign key (away_team_id) references teams (id) on delete set null,
  add constraint matches_league_id_fkey
    foreign key (league_id) references leagues (id) on delete set null;

-- ---------------------------------------------------------------------------
-- Backfill from the names/slugs already stored on matches.
-- ---------------------------------------------------------------------------
insert into leagues (slug, name)
  select distinct league_slug, league
  from matches
  where league_slug is not null
  on conflict (slug) do nothing;

insert into teams (name)
  select home_team from matches
  union
  select away_team from matches
  on conflict (name) do nothing;

update matches m set league_id = l.id
  from leagues l where m.league_slug = l.slug;
update matches m set home_team_id = t.id
  from teams t where m.home_team = t.name;
update matches m set away_team_id = t.id
  from teams t where m.away_team = t.name;

-- ---------------------------------------------------------------------------
-- RLS: public read-only, like matches. Writes happen via the service-role
-- admin client (sync), which bypasses RLS.
-- ---------------------------------------------------------------------------
alter table leagues enable row level security;
alter table teams enable row level security;

create policy "Leagues are viewable by everyone"
  on leagues for select using (true);
create policy "Teams are viewable by everyone"
  on teams for select using (true);

-- Mirror the explicit grants the other tables get (see
-- 20260607141854_grant_table_privileges.sql).
grant all on table public.leagues to anon, authenticated, service_role;
grant all on table public.teams to anon, authenticated, service_role;
