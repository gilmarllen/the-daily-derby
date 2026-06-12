-- Rename the "achievements" feature to "missions" across the schema. Tables are
-- renamed in place (the player_stats view that aggregates them is
-- dependency-tracked, so Postgres rewrites it automatically; get_leaderboard
-- reads that view, not the tables, so it keeps working). Constraints and
-- policies are renamed too so the schema reads cleanly and generated types match.

alter table achievements rename to missions;
alter table user_achievements rename to user_missions;

alter table user_missions rename column achievement_id to mission_id;
alter table user_missions rename column earned_at to completed_at;

-- Constraints (names don't auto-follow a table/column rename).
alter table missions rename constraint achievements_pkey to missions_pkey;
alter table missions rename constraint achievements_key_key to missions_key_key;
alter table user_missions rename constraint user_achievements_pkey to user_missions_pkey;
alter table user_missions
  rename constraint user_achievements_achievement_id_fkey to user_missions_mission_id_fkey;
alter table user_missions
  rename constraint user_achievements_user_id_fkey to user_missions_user_id_fkey;

-- Policies (names are cosmetic but kept consistent).
alter policy "Achievements are viewable by everyone" on missions
  rename to "Missions are viewable by everyone";
alter policy "Earned achievements are viewable by everyone" on user_missions
  rename to "Completed missions are viewable by everyone";
