-- The Daily Derby — initial schema.
-- Domain rules live in CLAUDE.md; the numbers here mirror the intended
-- defaults (starting balance F$ 10.00, trophy deltas, etc.).

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type match_status as enum ('scheduled', 'finished');
create type match_result as enum ('home', 'draw', 'away');
create type pick_result as enum ('win', 'draw', 'loss', 'none');

-- ---------------------------------------------------------------------------
-- profiles: one row per auth user. Holds the player's game state.
-- ---------------------------------------------------------------------------
create table profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text not null unique,
  trophies    integer not null default 0,           -- can go negative
  balance     numeric(10, 2) not null default 10.00, -- starting balance F$ 10.00
  win_streak  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- matches: the global daily pool (up to 50 rows per match_day). Each player
-- is shown 5 random matches drawn from this pool for the day.
-- ---------------------------------------------------------------------------
create table matches (
  id            uuid primary key default gen_random_uuid(),
  external_id   text unique,                  -- id from odds-api.io
  match_day     date not null,               -- the UTC day this fixture belongs to
  league        text not null,
  kickoff       timestamptz not null,
  home_team     text not null,
  away_team     text not null,
  home_odds     numeric(6, 2) not null,
  away_odds     numeric(6, 2) not null,
  status        match_status not null default 'scheduled',
  result        match_result,                -- null until finished
  home_score    integer,
  away_score    integer,
  created_at    timestamptz not null default now()
);

create index matches_match_day_idx on matches (match_day);

-- ---------------------------------------------------------------------------
-- picks: at most one pick per player per day. A null match_id / 'none' result
-- represents the default "No Selection".
-- ---------------------------------------------------------------------------
create table picks (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles (id) on delete cascade,
  match_day     date not null,
  match_id      uuid references matches (id) on delete set null,
  picked_side   match_result,               -- 'home' | 'away' (never 'draw'); null = no selection
  cost          numeric(10, 2) not null default 0,  -- 10 / odds, charged at pick time
  result        pick_result,                -- null until settled
  trophy_delta  integer,                    -- null until settled
  settled_at    timestamptz,
  created_at    timestamptz not null default now(),
  unique (user_id, match_day)               -- one pick per day
);

create index picks_user_id_idx on picks (user_id);

-- ---------------------------------------------------------------------------
-- achievements: static catalog. user_achievements records who earned what.
-- ---------------------------------------------------------------------------
create table achievements (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique,         -- stable slug, e.g. 'win-streak-10'
  title       text not null,
  description text not null,
  sort_order  integer not null default 0
);

create table user_achievements (
  user_id        uuid not null references profiles (id) on delete cascade,
  achievement_id uuid not null references achievements (id) on delete cascade,
  earned_at      timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

-- ---------------------------------------------------------------------------
-- New-user trigger: create a profile (with starting balance) on signup.
-- ---------------------------------------------------------------------------
create function handle_new_user()
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
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table profiles enable row level security;
alter table matches enable row level security;
alter table picks enable row level security;
alter table achievements enable row level security;
alter table user_achievements enable row level security;

-- profiles: everyone can read (leaderboard); you may only update your own row.
create policy "Profiles are viewable by everyone"
  on profiles for select using (true);
create policy "Users can update own profile"
  on profiles for update using ((select auth.uid()) = id);

-- matches: public read-only. Writes happen via the service-role admin client.
create policy "Matches are viewable by everyone"
  on matches for select using (true);

-- picks: a player can read and create their own picks. Settling (update) is
-- done server-side with the service-role key, which bypasses RLS.
create policy "Users can view own picks"
  on picks for select using ((select auth.uid()) = user_id);
create policy "Users can create own picks"
  on picks for insert with check ((select auth.uid()) = user_id);

-- achievements catalog: public read.
create policy "Achievements are viewable by everyone"
  on achievements for select using (true);

-- user_achievements: public read (so the leaderboard/profile can show badges).
-- Awarding is service-role only.
create policy "Earned achievements are viewable by everyone"
  on user_achievements for select using (true);
