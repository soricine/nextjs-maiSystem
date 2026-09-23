# Physical Email — Virtual Mailbox Platform

**Physical mail, managed like email.**

Mail arrives at a real street address. Staff photograph each envelope and log
it. The customer sees it as a list in a web panel — like an inbox — and chooses
what happens to it in the real world: **open & scan**, **shred**, or
**forward**.

Three roles: `CUSTOMER`, `STAFF`, `ADMIN`.

> **Read these two first.** They are short.
> [`docs/product-overview.md`](docs/product-overview.md) — what we are building.
> [`DESIGN.md`](DESIGN.md) — the UI rules. Required before you touch any screen.

---

## Quick start

```bash
pnpm install                  # 1. install packages
cp .env.example .env          # 2. create your config, then edit JWT_SECRET
pnpm exec prisma generate     # 3. generate the typed database client
pnpm exec prisma migrate dev  # 4. create the database tables
pnpm seed                     # 5. create test accounts
pnpm dev                      # 6. open http://localhost:3334
```

No Docker needed. Local development uses a SQLite file at
`prisma/database.sqlite3`.

**The app runs on port 3334, not 3000.**

---

## What you need installed

| Tool    | Version       | Install                                                  |
| ------- | ------------- | -------------------------------------------------------- |
| Node.js | 20.9 or newer | [nodejs.org](https://nodejs.org) — Next.js 16 needs this |
| pnpm    | 9 or newer    | `npm install -g pnpm`                                    |

```bash
node -v      # must be v20.9+
pnpm -v
```

---

## Setup, step by step

### Step 1 — Install packages

```bash
pnpm install
```

### Step 2 — Create your `.env`

```bash
cp .env.example .env
```

Then open `.env` and set a real `JWT_SECRET`:

```bash
openssl rand -base64 48
```

`.env.example` explains every value. Two things to know:

- **`DATABASE_URL`** is already set to SQLite and needs no change.
  The path is relative to the `prisma/` folder, not the project root.
- **`RESEND_API_KEY`** can stay empty. Password-reset codes are printed to the
  server console instead of emailed, so you can still test the flow.

`.env` is gitignored. Never commit it.

### Step 3 — Generate the Prisma client

```bash
pnpm exec prisma generate
```

This reads `prisma/schema.prisma` and writes the typed client. Without it,
TypeScript does not know what `prisma.user` is.

> **Run this every time you edit `prisma/schema.prisma`.** Package build
> scripts are disabled in `pnpm-workspace.yaml`, so it does _not_ run
> automatically after `pnpm install`.

### Step 4 — Create the tables

```bash
pnpm exec prisma migrate dev
```

### Step 5 — Create test accounts

```bash
pnpm seed
```

> Use `pnpm seed`, **not** `prisma db seed` — the `prisma.seed` key is not
> configured in `package.json`.

| Email                  | Password       | Role     |
| ---------------------- | -------------- | -------- |
| `admin@example.com`    | `Admin123!`    | ADMIN    |
| `staff@example.com`    | `Staff123!`    | STAFF    |
| `customer@example.com` | `Customer123!` | CUSTOMER |

### Step 6 — Run it

```bash
pnpm dev
```

Open **http://localhost:3334**.

---

## Everyday commands

| Command                       | What it does                                                               |
| ----------------------------- | -------------------------------------------------------------------------- |
| `pnpm dev`                    | Dev server on port 3334                                                    |
| `pnpm build`                  | Production build — **run this before you push**, it type-checks everything |
| `pnpm start`                  | Serve the production build                                                 |
| `pnpm typecheck`              | Type errors only, faster than a full build                                 |
| `pnpm lint` / `pnpm lint:fix` | ESLint                                                                     |
| `pnpm format`                 | Prettier, rewrites files                                                   |
| `pnpm seed`                   | Re-create the three test accounts                                          |
| `pnpm db:studio`              | GUI to browse the database — **use this constantly**                       |
| `pnpm db:migrate`             | Apply schema changes                                                       |
| `pnpm db:reset`               | Wipe and rebuild the database (deletes all data)                           |
| `pnpm create-admin`           | Create `admin@admin.com` / `12345678`                                      |
| `pnpm remove-admin`           | Demote `admin@example.com` to STAFF                                        |

When something looks wrong, open `pnpm db:studio` and look at the real rows
before you start guessing.

---

## Where things live

```
src/
├── app/                        # Next.js App Router — folders become URLs
│   ├── layout.tsx              # root layout: fonts, metadata, providers
│   ├── providers.tsx           # React Query + React Aria router
│   ├── globals.css             # the ONLY stylesheet (see DESIGN.md)
│   ├── page.tsx                # "/" — reference page for the design system
│   ├── (public)/               # unauthenticated pages, share a layout
│   │   ├── layout.tsx          # centred card shell
│   │   ├── login/page.tsx      # /login   — the "(public)" folder is not a URL
│   │   └── signup/page.tsx     # /signup
│   └── api/auth/**/route.ts    # the REST back-end
│
├── components/ui/              # every shared component lives here
│   ├── layout.tsx              # Box, Stack, Row, Container, Main, Section...
│   ├── typography.tsx          # PageTitle, BodyText, MutedText, Eyebrow...
│   ├── button-link.tsx         # a link that looks like a button
│   └── form.tsx                # RhfTextField, FormAlert, error helpers
│
└── lib/
    ├── cn.ts                   # Tailwind class merging — use everywhere
    ├── db/prisma.ts            # the ONE Prisma client
    ├── db/auth.ts              # user + token queries
    ├── server/jwt.ts           # signs and verifies the two JWTs
    ├── server/api.ts           # parseBody, requireAuth, handleApiError
    ├── api/client.ts           # browser fetch wrapper (auto token refresh)
    ├── api/auth.ts             # React Query hooks: useMe, useLogin, ...
    └── validation/auth.ts      # zod schemas shared by browser AND server

prisma/schema.prisma            # the database shape — single source of truth
docs/                           # product and architecture docs
```

**App Router naming:** `page.tsx` = a page, `layout.tsx` = a wrapper,
`route.ts` = an API endpoint. `[brackets]` = a dynamic segment.
`(parentheses)` = a group that shares a layout **without** adding to the URL.

📖 [Project structure & conventions](https://nextjs.org/docs/app/getting-started/project-structure)

---

## The design rules

Full details in [`DESIGN.md`](DESIGN.md). The short version:

| Rule                | Do                                                      | Don't                          |
| ------------------- | ------------------------------------------------------- | ------------------------------ |
| Elements            | `Box`, `Stack`, `Section` from `@/components/ui/layout` | `<div>`, `<section>`, `<nav>`  |
| Components          | [HeroUI](https://www.heroui.com)                        | Hand-rolled buttons and inputs |
| Styling             | Tailwind classes                                        | `.css` files, CSS modules      |
| Inline style        | Tailwind classes                                        | `style={{ color: "red" }}`     |
| Conditional classes | `cn()` from `@/lib/cn`                                  | String concatenation           |
| Text                | `PageTitle`, `BodyText`, `MutedText`                    | `<h1>`, `<p>`                  |
| Forms               | `RhfTextField` + `react-hook-form` + `zod`              | `<input>` + `useState`         |

`src/app/page.tsx` is the reference implementation. Copy its patterns.

### Why layout primitives instead of `<div>`

A `<div>` carries no design decisions, so every developer invents their own
spacing. `Box` and friends wrap HeroUI's `Surface`, so the whole app shares one
set of primitives — and `Section`, `Header`, `Nav`, `Main`, `Footer` still emit
the real semantic tag underneath, which screen readers and search engines need.

```tsx
import { Container, Section, Stack } from "@/components/ui/layout";
import { PageTitle, BodyText } from "@/components/ui/typography";

<Section className="py-24">
  <Container>
    <Stack className="gap-4">
      <PageTitle>Your mail</PageTitle>
      <BodyText color="muted">Nothing here yet.</BodyText>
    </Stack>
  </Container>
</Section>;
```

📖 [HeroUI components](https://www.heroui.com/docs/components/button)
· [Tailwind utility classes](https://tailwindcss.com/docs/styling-with-utility-classes)

---

## How to do good work here — examples

### 1. Querying the database

Always import the shared client. Never write `new PrismaClient()` in a route —
it opens a new connection pool on every hot reload.

```ts
// ✅ good
import { prisma } from "@/lib/db/prisma";

const users = await prisma.user.findMany({
  where: { role: "CUSTOMER" },
  select: { id: true, name: true, email: true }, // never select `password`
  orderBy: { createdAt: "desc" },
});
```

**Always use `select`.** It keeps responses small and stops you accidentally
sending `password` to the browser. TypeScript then knows the exact shape.

📖 [Prisma CRUD queries](https://www.prisma.io/docs/orm/prisma-client/queries/crud)
· [Selecting fields](https://www.prisma.io/docs/orm/prisma-client/queries/select-fields)
· [Type safety](https://www.prisma.io/docs/orm/prisma-client/type-safety)

### 2. Changing the database shape

Never write SQL by hand. Edit the schema and let Prisma do it:

```bash
# 1. edit prisma/schema.prisma
pnpm exec prisma migrate dev --name add_mailbox
pnpm exec prisma generate
```

> **SQLite has no enums.** That is why `User.role` is a `String` and the
> allowed values live in `ROLES` in `src/lib/validation/auth.ts`. Validate
> roles with zod, not with a Prisma enum.

📖 [Prisma schema](https://www.prisma.io/docs/orm/prisma-schema)
· [Relations](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations)
· [Migrate](https://www.prisma.io/docs/orm/prisma-migrate)

### 3. Writing an API route

The helpers in `src/lib/server/api.ts` do the repetitive parts. A route is
three steps: **validate → authorise → do the work.**

```ts
// src/app/api/mailboxes/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db/prisma";
import {
  ApiRouteError,
  handleApiError,
  parseBody,
  requireAuth,
} from "@/lib/server/api";

const createMailboxSchema = z.object({
  label: z.string().trim().min(2, "Label must be at least 2 characters"),
  locationId: z.string().cuid(),
});

export async function POST(request: Request) {
  try {
    const user = await requireAuth(request); // throws 401 if no token

    if (user.role !== "STAFF" && user.role !== "ADMIN") {
      throw new ApiRouteError(403, "Only staff can create mailboxes");
    }

    const data = await parseBody(request, createMailboxSchema); // throws 400
    const mailbox = await prisma.mailbox.create({ data });

    return NextResponse.json({ mailbox }, { status: 201 });
  } catch (error) {
    return handleApiError(error); // logs the real error, returns a safe one
  }
}
```

**Rules:**

- **Never trust the browser.** Re-check the role on the server every time.
  Hiding a button is not security.
- **Validate with `zod`,** in `src/lib/validation/`, so the browser and the
  server enforce the same rules from one schema.
- **Never leak internals.** `handleApiError` logs the real error and returns a
  generic message. Keep it that way.
- **Status codes:** 400 bad input, 401 not logged in, 403 not allowed,
  404 missing, 409 conflict, 500 our bug.

📖 [Route handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route)
· [Zod](https://zod.dev)

### 4. Server vs client components

**Default to a server component.** Add `"use client"` only when you need
`useState`, `useEffect`, or an event handler.

```tsx
// ✅ server component — no "use client", no fetch, no loading state
import { prisma } from "@/lib/db/prisma";

export default async function MembersPage() {
  const members = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
  });
  return <MemberTable members={members} />;
}
```

**Never import anything from `@/lib/db/` or `@/lib/server/` into a file with
`"use client"`.** It would bundle the database driver — and your JWT secret —
into the browser.

📖 [Server & client components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
· [Fetching data](https://nextjs.org/docs/app/getting-started/fetching-data)
· [Official Next.js examples](https://github.com/vercel/next.js/tree/canary/examples)

### 5. Forms

One zod schema, `react-hook-form` for state, `RhfTextField` for the inputs, and
the submit button disabled until the form is valid.

```tsx
"use client";

import { Button, Form } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  FormAlert,
  RhfTextField,
  generalErrorMessage,
} from "@/components/ui/form";
import { useLogin } from "@/lib/api/auth";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";

export function LoginForm() {
  const login = useLogin();
  const { control, handleSubmit, formState } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // needed so `isValid` updates while typing
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => login.mutate(values));

  return (
    <Form
      validationBehavior="aria"
      onSubmit={onSubmit}
      className="flex flex-col gap-4"
    >
      {/* one place for "wrong password" and other non-field errors */}
      <FormAlert status="danger" message={generalErrorMessage(login.error)} />

      <RhfTextField control={control} name="email" label="Email" type="email" />
      <RhfTextField
        control={control}
        name="password"
        label="Password"
        type="password"
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isDisabled={!formState.isValid || login.isPending}
      >
        {login.isPending ? "Signing in…" : "Sign in"}
      </Button>
    </Form>
  );
}
```

`src/app/(public)/login/page.tsx` is the working version — read it.

📖 [react-hook-form](https://react-hook-form.com/get-started)
· [`@hookform/resolvers`](https://github.com/react-hook-form/resolvers)

### 6. Conditional classes

```tsx
import { cn } from "@/lib/cn";

<Box
  className={cn("px-4 py-2", isActive && "bg-accent text-accent-foreground")}
/>;
```

`cn("p-2", "p-4")` gives `p-4`. Plain string joining keeps both and lets CSS
order decide at random.

### 7. How login actually works

Two JWTs, per [`docs/architecture.md`](docs/architecture.md):

| Token             | Lifetime | Purpose                                            |
| ----------------- | -------- | -------------------------------------------------- |
| **auth token**    | 15 min   | sent as `Authorization: Bearer …` on every request |
| **refresh token** | 30 days  | exchanges for a new auth token when it expires     |

Both live in `localStorage`. `src/lib/api/client.ts` handles this for you: on a
401 it refreshes once and retries. **Call the hooks in `src/lib/api/auth.ts`
(`useMe`, `useLogin`, …), never `fetch` directly.**

### 8. General habits

- **Use `@/` imports.** `@/lib/db/prisma`, not `../../../lib/db/prisma`.
- **Run `pnpm build` before pushing.** `pnpm dev` does not type-check.
- **No `console.log` in committed code.**
- **Small commits with clear messages.** `add mailbox list to staff dashboard`
  beats `fix bug`.
- **Never log, return, or commit a password, hash, or token.**

---

## Learning links

**Prisma + TypeScript**

- [Getting started with TypeScript](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql) — start here
- [Prisma with Next.js](https://www.prisma.io/docs/guides/nextjs)
- [CRUD](https://www.prisma.io/docs/orm/prisma-client/queries/crud) · [Filtering & sorting](https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting) · [Relation queries](https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries)
- [CLI reference](https://www.prisma.io/docs/orm/reference/prisma-cli-reference)

**HeroUI (v3)**

- [heroui.com](https://www.heroui.com) — component gallery, copy the code
- [Next.js setup](https://www.heroui.com/docs/frameworks/nextjs)
- [Theming](https://www.heroui.com/docs/customization/theme)

**Next.js App Router**

- [App Router docs](https://nextjs.org/docs/app)
- [Learn Next.js — free interactive course](https://nextjs.org/learn) — best starting point
- [Layouts and pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages)
- [Route handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route)
- [Example apps](https://github.com/vercel/next.js/tree/canary/examples)

**Everything else**

- [Zod](https://zod.dev) · [react-hook-form](https://react-hook-form.com/get-started)
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Tailwind CSS v4](https://tailwindcss.com/docs/styling-with-utility-classes)
- [jose (JWT)](https://github.com/panva/jose)

---

## Troubleshooting

| Problem                                                 | Fix                                                                                    |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `Environment variable not found: DATABASE_URL`          | You skipped `cp .env.example .env`                                                     |
| `Property 'user' does not exist on type 'PrismaClient'` | `pnpm exec prisma generate`                                                            |
| Types wrong after a schema edit                         | `pnpm exec prisma generate`, then restart your editor's TS server                      |
| `The table main.User does not exist`                    | `pnpm exec prisma migrate dev`                                                         |
| Port 3334 already in use                                | `lsof -ti:3334 \| xargs kill`                                                          |
| Styles missing / page unstyled                          | Restart `pnpm dev`. Tailwind only scans `src/**` — see `@source` in `globals.css`      |
| Weird build errors after pulling                        | `rm -rf .next && pnpm install && pnpm dev`                                             |
| Password-reset email never arrives                      | Expected with an empty `RESEND_API_KEY`. The code is printed in the dev-server console |

Reset the database completely (**deletes all data**):

```bash
pnpm db:reset && pnpm seed
```

---

## Deployment

Per [`docs/architecture.md`](docs/architecture.md) the app splits in two:

| Artifact             | Runs on                                  |
| -------------------- | ---------------------------------------- |
| Front-end (static)   | CloudFlare Pages, GitHub Pages, or NGiNX |
| Back-end (`/api/**`) | A Node.js server or Docker               |

For production, switch `provider` in `prisma/schema.prisma` to `postgresql`,
point `DATABASE_URL` at your Postgres instance, and run
`pnpm exec prisma migrate deploy`. `docker-compose.yml` starts a local Postgres
if you want to test that path — it is **not** needed for normal development.

Because SQLite has no enums, moving to PostgreSQL is a chance to turn
`User.role` back into a real enum. Do it in a migration, not by hand.

---

## Known issues — good first tasks

- [ ] `prisma/seed.ts` and `scripts/create-admin.ts` create accounts with weak
      hard-coded passwords. Fine for local dev, must never reach production.
- [ ] `@heroui/react@3.2.6` ships its `dom.*` module without a `"use client"`
      directive, so it cannot be imported by a server component. Contained in
      `src/components/ui/layout.tsx`, which uses `Surface` instead.
- [ ] No tests yet. The zod schemas in `src/lib/validation/` and the token
      logic in `src/lib/server/jwt.ts` are the highest-value places to start.
- [ ] The dashboards for customer, staff, and admin do not exist yet — only the
      public pages and the auth API are built.

What to build next is in [`docs/features.md`](docs/features.md) and
[`docs/domain-model.md`](docs/domain-model.md).
