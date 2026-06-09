-- daily_pools: freezes the 5 matches a player is shown for a given UTC day.
-- The per-player pick is otherwise deterministic (seeded by user + day), but
-- persisting it means edits to the matches pool mid-day can't reshuffle what a
-- player already saw.

create table daily_pools (
  user_id    uuid not null references profiles (id) on delete cascade,
  match_day  date not null,                 -- the UTC day this pool is for
  match_ids  uuid[] not null,               -- the frozen set of matches shown
  created_at timestamptz not null default now(),
  primary key (user_id, match_day)
);

alter table daily_pools enable row level security;

-- A player can read and create their own frozen pool. There's no update path:
-- once frozen for the day, it stays put.
create policy "Users can view own daily pool"
  on daily_pools for select using ((select auth.uid()) = user_id);
create policy "Users can create own daily pool"
  on daily_pools for insert with check ((select auth.uid()) = user_id);

-- Mirror the base privileges granted to the other tables (RLS still applies).
grant all on table public.daily_pools to anon, authenticated, service_role;
