# Architecture & Engineering Decisions

## Deployment model

The app is split into two independently deployable artifacts:

| Artifact      | What it is                                    | Where it runs             |
| ------------- | --------------------------------------------- | ------------------------- |
| **Front-end** | Static files (`next export` output)           | CloudFlare Pages or NGiNX |
| **Back-end**  | Next.js server handling only `/api/**` routes | Node.js server / Docker   |

**Rule:** The front-end is a dumb static client. It never touches the database, never imports Prisma, and never runs server-only code. All data access goes through REST API calls.

## Database

| Environment       | Provider   | Connection                                                                                                           |
| ----------------- | ---------- | -------------------------------------------------------------------------------------------------------------------- |
| Local development | SQLite     | `file:./database.sqlite3` (Prisma resolves it relative to `prisma/`, so the file lives at `prisma/database.sqlite3`) |
| Production        | PostgreSQL | `postgresql://...` connection string                                                                                 |

Both are configured via the `DATABASE_URL` environment variable. The Prisma `provider` field in `schema.prisma` must match the environment:

```prisma
// local dev
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// production
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Switching:** Update `prisma/schema.prisma` and run `pnpm prisma migrate dev` when switching environments. SQLite lets you iterate locally without Docker; PostgreSQL is used in staging and production (see `docker-compose.yml` for the local Postgres alternative).

**Rule:** Database code (Prisma client, schema imports, raw SQL) lives only in:

- `src/app/api/**` — API route handlers
- `src/lib/db/**` — shared DB helpers imported by API routes
- `prisma/` — schema, migrations, seed scripts
- `scripts/` — admin CLI scripts

## API design

All back-end logic is exposed as REST endpoints under `/api/`.

- Use standard HTTP verbs: `GET` (read), `POST` (create), `PUT`/`PATCH` (update), `DELETE` (remove).
- Return appropriate HTTP status codes (`200`, `201`, `400`, `401`, `403`, `404`, `409`, `500`).
- Request and response bodies are JSON.
- Endpoints are versioned implicitly by path; no `/v1/` prefix needed until a breaking change requires it.
- API routes live in `src/app/api/` following the Next.js App Router file convention (`route.ts`).

Example structure:

```
src/app/api/
  auth/
    login/route.ts
    refresh/route.ts
    logout/route.ts
  mail-items/
    route.ts          # GET (list), POST (create)
    [id]/route.ts     # GET, PATCH, DELETE
```

## Authentication

Two JWTs are issued at login:

| Token             | Lifetime       | Storage        |
| ----------------- | -------------- | -------------- |
| **Auth token**    | Short (15 min) | `localStorage` |
| **Refresh token** | Long (30 days) | `localStorage` |

- Every API request sends `Authorization: Bearer <auth-token>`.
- On `401`, the front-end calls `POST /api/auth/refresh` with the refresh token, gets a new auth token, then retries the original request.
- On logout (`POST /api/auth/logout`), both tokens are invalidated server-side (revoked in the DB) and removed from `localStorage`.
- **Never** store tokens in cookies (to keep the front-end fully static and avoid CSRF concerns).

## Front-end data fetching

Use **TanStack Query** (`@tanstack/react-query`) for all API calls from the front-end.

- Wrap the app in `<QueryClientProvider>` at the root layout.
- Define one query/mutation hook per API resource in `src/lib/api/`.
- TanStack Query handles caching, deduplication across tabs, background refetching, and loading/error states.
- Do **not** call `fetch` directly in components — always go through a query hook.

Example pattern:

```ts
// src/lib/api/mail-items.ts
export function useMailItems(mailboxId: string) {
  return useQuery({
    queryKey: ["mail-items", mailboxId],
    queryFn: () => apiFetch(`/api/mail-items?mailboxId=${mailboxId}`),
  });
}
```

## Package manager

Use **pnpm** exclusively. Do not use `npm` or `yarn`.
