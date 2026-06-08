-- matches.match_day is redundant: the UTC match day is derivable from kickoff.
-- The fixture sync now counts/queries the daily pool by a kickoff time window.
-- (picks.match_day is unaffected — that's the day a player's pick belongs to.)

drop index if exists matches_match_day_idx;
alter table matches drop column match_day;

-- Keep day-window lookups fast now that we filter matches by kickoff.
create index matches_kickoff_idx on matches (kickoff);
