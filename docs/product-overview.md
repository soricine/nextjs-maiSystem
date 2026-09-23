# Product Overview

## What this is

A **virtual mailbox platform**: it makes physical mail feel like email.

Mail arrives at a real street address (a physical mailbox rented from a mailbox
operator). The operator's staff photograph each envelope and log it into the
system. The customer sees their mail as a list in a web panel — like an email
inbox — and decides, item by item, what should happen to it in the real world:

- **Open & scan** — staff open the envelope, scan the contents, and upload a PDF/images.
- **Shred** — staff destroy the item; it is marked deleted.
- **Forward** — staff mail the item to a physical address the customer provides.

Comparable commercial services: Virtual Post Mail, Traveling Mailbox,
Earth Class Mail.

## Who uses it

There are three kinds of people in the system:

| Role               | Who they are                                  | What they do                                                                                                          |
| ------------------ | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Customer**       | Rents one or more mailboxes                   | Views their inbox, requests open-and-scan / shred / forward, manages recipients and payment                           |
| **Operator staff** | Works at a physical mailbox location          | Photographs incoming mail, fulfils customer requests (scan, shred, forward), marks items with their real-world status |
| **Admin**          | Runs the platform (or an operator's business) | Manages user accounts, operator/location settings, plans and pricing                                                  |

These map to the existing `Role` enum in `prisma/schema.prisma`
(`CUSTOMER`, `STAFF`, `ADMIN`).

## Key product rules

These are the business rules the rest of the design hangs off. Numbers in
parentheses are defaults, expected to become per-operator or per-plan settings.

1. **One customer, many mailboxes.** A customer may rent mailboxes in
   different cities, potentially from _different operators_. The panel must
   present all of a customer's mailboxes under one login.
2. **Extra recipients cost money.** A mailbox accepts mail for its primary
   holder plus additional names or company names the customer adds. A plan
   includes some number of recipients; beyond that, each additional recipient
   carries a fee.
3. **Mail doesn't stay forever.** Physical mail is auto-shredded after a
   retention window (30 days) unless the customer pays to hold it on-site
   longer.
4. **The panel reflects reality, not the other way around.** A customer's
   "shred"/"scan"/"forward" click is a _request_. The item's status only
   changes when operator staff perform the physical action and mark it done.

## What exists today vs. what's planned

**Implemented:** authentication (NextAuth, credentials), the three roles,
role-specific layouts and dashboard shells, admin management of members and
staff, PostgreSQL via Prisma in Docker.

**Planned (the core of the product, not yet built):** operators, locations,
mailboxes, recipients, mail items and their lifecycle, scan storage,
forwarding addresses, retention/auto-shred, billing.

See [features.md](features.md) for the full feature reference and
[domain-model.md](domain-model.md) for the entities and the mail-item state
machine.
