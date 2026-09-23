# Claude Agent Instructions

Before writing or editing any UI code, read `DESIGN.md` in full.
Before writing or editing any API, database, or data-fetching code, read `docs/architecture.md` in full.

## Non-negotiable rules

- **No native HTML elements in JSX.** Use HeroUI components exclusively. See `DESIGN.md`.
- **No CSS files or inline styles.** Use Tailwind utility classes only.
- **No `style={{}}` props.**
- Use `tailwind-merge` for conditional class merging.
- **No database code on the front-end.** No Prisma imports outside `src/app/api/`, `src/lib/db/`, `prisma/`, and `scripts/`.
- **No direct `fetch` calls in components.** Use TanStack Query hooks from `src/lib/api/`.
- **REST API only.** All data access from the front-end goes through `/api/` routes.

## Stack

- Framework: Next.js (App Router) + TypeScript
- Database: SQLite (local dev) / PostgreSQL (production) via Prisma
- Auth: Dual-JWT pattern — auth token + refresh token, stored in `localStorage` (see `DESIGN.md` and `docs/architecture.md`)
- UI: HeroUI + Tailwind CSS
- Forms: react-hook-form + zod
- API client: TanStack Query (`@tanstack/react-query`)
- Package manager: pnpm

## Before you start any task

1. Read `DESIGN.md`
2. Read `docs/architecture.md`
3. Check whether HeroUI has a component that fits before creating anything new
4. Follow the public/dashboard layout split described in `DESIGN.md`
