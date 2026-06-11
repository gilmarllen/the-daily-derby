# The Daily Derby ⚽🏆

A daily football prediction game. Players pick winning teams from real matches,
manage their **F$** (Football Money), earn trophies, and compete on a global
leaderboard.

## Tech Stack

- **[Next.js](https://nextjs.org) 16** (App Router) + **React 19**
- **TypeScript**
- **[Tailwind CSS](https://tailwindcss.com) v4** + **[shadcn/ui](https://ui.shadcn.com)**
- **[Vitest](https://vitest.dev)** + **React Testing Library**
- **ESLint** + **Prettier**
- **Husky** + **lint-staged** (pre-commit checks)
- **Supabase** (auth + DB)
- **Vercel** (hosting)
- [odds-api.io](https://odds-api.io/) (fixtures & odds)

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

| Script                  | Description                      |
| ----------------------- | -------------------------------- |
| `npm run dev`           | Start the dev server             |
| `npm run build`         | Production build                 |
| `npm run start`         | Serve the production build       |
| `npm run lint`          | Lint with ESLint                 |
| `npm run lint:fix`      | Lint and auto-fix                |
| `npm run typecheck`     | Type-check with `tsc` (no emit)  |
| `npm run format`        | Format all files with Prettier   |
| `npm run format:check`  | Check formatting without writing |
| `npm run test`          | Run the test suite once          |
| `npm run test:watch`    | Run tests in watch mode          |
| `npm run test:coverage` | Run tests with a coverage report |

## Project Structure

```
src/
  app/         # App Router routes, layout, and global styles
  components/
    ui/        # shadcn/ui components
  lib/         # Shared utilities (e.g. cn helper)
```

## Code Quality

A Husky `pre-commit` hook runs `lint-staged`, which lints and formats staged
files before each commit.
