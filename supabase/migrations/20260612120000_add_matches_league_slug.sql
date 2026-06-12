-- Store the odds-api league slug alongside the display name. The daily-pool
-- weighting can then look up src/lib/odds/league-weights.json by the exact slug
-- (set at sync time) instead of re-deriving it from the display name.
--
-- Nullable: rows synced before this column existed stay null and fall back to
-- name-derived weighting until backfilled / re-synced.

alter table matches add column league_slug text;
