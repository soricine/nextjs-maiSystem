# Design System

## Core Rule

**Never use native HTML elements directly in JSX.** Every UI element must be built from a HeroUI base component, customized or extended as needed. If no HeroUI component fits, compose one from HeroUI primitives before reaching for a raw `<div>`, `<button>`, `<input>`, etc.

## Component Library

Use [HeroUI](https://heroui.com) as the foundation for all UI components.

- Prefer HeroUI's pre-built components (`Button`, `Input`, `Card`, `Link`, `Navbar`, etc.) over rolling your own.
- Extend or wrap HeroUI components to create project-specific variants (e.g. a `<PrimaryButton>` that wraps HeroUI's `<Button color="primary">`).
- All typography should be wrapped in a component (e.g. `<BodyText>`, `<PageTitle>`) derived from an appropriate HeroUI primitive.

## Component conventions

- **One component per file.** Each reusable component lives in its own `.tsx` file with a named export.
- **No default exports for components.** Use named exports so imports are explicit and rename-safe.
- **Props types must be named and exported.** Never use inline anonymous object types as props. Define a `type FooProps = { ... }` and export it alongside the component. This makes the type importable for extension and keeps the component signature readable.

```tsx
// ✅ Correct
export type ButtonLinkProps = { href: string; children: ReactNode };
export function ButtonLink({ href, children }: ButtonLinkProps) { ... }

// ❌ Wrong — anonymous inline type, not reusable
export function ButtonLink({ href, children }: { href: string; children: ReactNode }) { ... }
```

- **Group related components in a subdirectory** with an `index.ts` barrel that re-exports everything. Import from the directory path, not from the individual file:

```ts
// ✅ Correct
import { Stack, Row } from "@/components/ui/layout";

// ❌ Wrong — reaching into the file directly
import { Stack } from "@/components/ui/layout/stack";
```

## Utility functions

- **One utility per file**, or group by domain when functions are tightly coupled (e.g. all form-error helpers together, all date-formatting helpers together).
- Always use **named exports** — no default exports from utility files.
- Utility files that are not components have a `.ts` extension (not `.tsx`).
- Place shared utilities under `src/lib/`. UI-specific utilities that depend on component types live alongside their components (e.g. `src/components/ui/form/form-utils.ts`).

## Styling

- Use **Tailwind CSS** utility classes (`className=""`) for all styling.
- Do **not** write CSS files or use CSS modules for component styles.
- Do **not** use inline `style={{}}` props.
- Use `tailwind-merge` (`twMerge`) when class names need to be conditionally merged or overridden.

## Layouts

Two layouts exist in `src/app`:

| Layout           | Path                           | Used for                                                        |
| ---------------- | ------------------------------ | --------------------------------------------------------------- |
| Public layout    | `src/app/(public)/layout.tsx`  | Unauthenticated pages: marketing, login, signup, password reset |
| Dashboard layout | `src/app/dashboard/layout.tsx` | Authenticated pages: customer, staff, and admin dashboards      |

The public layout owns the site chrome — the main nav bar (`SiteHeader`) and
footer (`SiteFooter`) from `@/components/site`. **Every public page keeps that
nav bar**, including the auth forms: a visitor who lands on sign in must always
be able to get back to the marketing page or over to sign up.

Auth pages nest one level deeper, in `src/app/(public)/(auth)/`. That group's
layout adds only the centred, max-width card wrapper; the nav bar and footer
still come from the public layout above it.

The dashboard layout has its own header (different nav, account menu, auth
guard) and does not use `SiteHeader`.

## Forms

- All form inputs must use HeroUI form components (`Input`, `Select`, `Checkbox`, etc.).
- Submit buttons must be disabled until the form is valid (use `react-hook-form` + `zod` for validation).
- Never use a raw `<input>`, `<select>`, or `<textarea>`.

## Authentication

- Two JWTs issued at login: **auth token** (short-lived) and **refresh token** (long-lived).
- Store both in `localStorage`.
- Send the auth token via `Authorization: Bearer <token>` on every API request.
- On 401, call `/api/auth/refresh` with the refresh token, then retry.
- On logout, clear both JWTs from the database and from `localStorage`.

## Project Purpose

This is a **virtual mailbox** — a system that makes physical mail feel like email. It is not a CMS or contact manager. All naming, copy, and UX decisions should reinforce the mail metaphor.
