-- Seed data applied on `supabase db reset` (local) and runnable against any
-- environment. Idempotent: safe to re-run.

insert into achievements (key, title, description, sort_order) values
  ('la-liga-3',   'La Liga Loyalist', 'Win on 3 days in La Liga.',                 1),
  ('win-streak-10', '10-Day Streak',  'Win 10 days in a row.',                     2),
  ('budget-player', 'Budget Player',  'Win a day while spending less than F$ 5.00.', 3),
  ('first-win',   'First Blood',      'Win your very first pick.',                 4),
  ('comeback',    'Comeback Kid',     'Win the day after a loss.',                 5)
on conflict (key) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;
