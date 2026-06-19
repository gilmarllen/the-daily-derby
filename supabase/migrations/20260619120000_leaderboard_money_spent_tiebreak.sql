-- Add money_spent as the third leaderboard sort criterion. Ties on trophies and
-- win_streak now break on money_spent (more spent ranks higher), then username.
-- Body/return type unchanged from 20260615140000_matches_source_of_truth.sql;
-- only the ORDER BY gains `money_spent desc`.

create or replace function public.get_leaderboard()
returns table (
  user_id uuid,
  username text,
  trophies integer,
  money_spent numeric,
  win_streak integer,
  today_pick text,
  today_result text,
  today_pick_crest text
)
language sql
security definer
set search_path = ''
as $$
  select
    ps.user_id,
    ps.username,
    ps.trophies,
    ps.money_spent,
    ps.win_streak,
    tp.today_pick,
    tp.today_result,
    tp.today_pick_crest
  from public.player_stats ps
  left join lateral (
    select
      case pk.picked_side
        when 'home' then ht.name
        when 'away' then at.name
      end as today_pick,
      pk.result::text as today_result,
      case pk.picked_side
        when 'home' then ht.crest_url
        when 'away' then at.crest_url
      end as today_pick_crest
    from public.picks pk
    join public.matches m on m.id = pk.match_id
    left join public.teams ht on ht.id = m.home_team_id
    left join public.teams at on at.id = m.away_team_id
    where pk.user_id = ps.user_id
      and pk.match_day = current_date
    limit 1
  ) tp on true
  order by ps.trophies desc, ps.win_streak desc, ps.money_spent desc, ps.username asc;
$$;

grant execute on function public.get_leaderboard() to anon, authenticated;
