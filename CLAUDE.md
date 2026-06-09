@AGENTS.md

# The Daily Derby

A daily football (soccer) prediction game. Players pick winning teams from real
matches, manage in-game money, earn trophies, and compete on a global
leaderboard. The product should **feel like a game, not a corporate app**.

This file captures domain rules and project standards that are **not derivable
from the code**. It describes the original product intent; where the code has
since evolved, the code reflects current behavior. If the two diverge in a way
that looks unintentional, it's worth flagging.

## Domain vocabulary

- **F$ (Football Money)** — the in-game currency. Always written `F$` with two
  decimals (e.g. `F$ 6.66`). It is _not_ real money.
- **Pick / Selection** — a player's single chosen team for a given day.
- **Match Pool** — the 5 matches a player sees on a given day.
- **Trophies** — the score/ranking unit (can go negative via losses).

## Core game rules

The values below come from the original design. Treat them as the intended
defaults; if a change calls for different numbers, that's fine — just make it a
deliberate, visible decision rather than an accidental drift.

- **Starting balance:** `F$ 10.00` at day 0.
- **One pick per day.** Players pick exactly one team to win.
- **Match pool:** each player sees **5 random matches** drawn from a global pool
  of **up to 50 matches/day** (the next day's fixtures). The 5 are per-player.
- **Selection cost:** `cost = 10 / matchOdds` (e.g. odds `1.50` → `F$ 6.66`).
- **Daily income:** `+F$ 4.00` every day.
- **Daily reset:** the loop restarts at **00:00 UTC**.
- **Affordability:** options the player can't afford are **disabled**.
- **No Selection** is always an available option, **selected by default**, and
  must look clearly different from the team options.

### Scoring (trophy deltas)

| Outcome           | Trophies |
| ----------------- | -------- |
| Win               | `+3`     |
| Draw              | `0`      |
| Loss              | `-1`     |
| No selection made | `-2`     |
| New achievement   | `+1`     |

### Leaderboard stats

Total trophies, total money spent, win streak.

### Achievements

Each has a **title** and a **large SVG**. Show **grayed out** until earned.
Examples: "Win 3 days in La Liga", "10-day win streak", "Budget player" (win
while spending `< F$ 5.00`).

## App surfaces

- **Home (logged out):** hero section + login / sign-up.
- **Dashboard (logged in):** trophy + money counts; the day's 5-match selection
  screen (two team options each with F$ cost); an "in-progress" banner showing
  the current day's pick; plus pages for **Achievements**, **Leaderboard**, and
  **Past Picks**. Logout reachable from somewhere in the shell.

## UX standards

- Game-like, simple, and intuitive — avoid a corporate look.
- **Responsive**, optimized for **both desktop and mobile**.
- **Animate interactions** — selecting a match option, and transitions between
  pages. Selected options get a clear indication (color change + icon).

## Planned integrations (not yet wired up)

- **Supabase** — authentication + database (leaderboard, picks, achievements).
  Uses the new API key format: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  (`sb_publishable_…`, client-safe) and `SUPABASE_SECRET_KEY` (`sb_secret_…`).
  The secret key is **server-only**; never expose it to the client.
- **[odds-api.io](https://odds-api.io/)** — fixtures, odds, and match scores.
- **Vercel** — hosting.

See `.env.example` for the expected environment variables.

## Working conventions

- **Keep it simple; don't overengineer.** Prefer the smallest change that fully
  solves the task.
- Before considering work done, it should pass: `npm run lint`,
  `npm run typecheck`, `npm run test`, and `npm run build`.
- Money math: round F$ to 2 decimals; never display raw floats.
