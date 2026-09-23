# Domain Model

The entities the product is built around, their relationships, and the
mail-item state machine. Only `User` exists in `prisma/schema.prisma` today;
everything else here is the target model for upcoming work. Field lists are
indicative, not exhaustive — treat this as the shared vocabulary, and keep the
names consistent when implementing.

## Entity relationships

```
Operator ──< Location ──< Mailbox >── Customer (User)
                             │
                             ├──< Recipient
                             │        │
                             └──< MailItem >──┘
                                      │
                                      ├──< MailItemEvent (audit log)
                                      ├──1 Scan (optional)
                                      └──1 Forward (optional) >── ForwardingAddress
```

Read `──<` as one-to-many. A customer can hold many mailboxes; a mailbox
belongs to exactly one customer and one location.

## Entities

### User _(exists)_

Login identity with a `Role`: `CUSTOMER`, `STAFF`, or `ADMIN`.

- Customers own mailboxes.
- Staff belong to an **operator** (to be added — today staff are global) and
  fulfil work at that operator's locations.
- Admins manage the platform.

### Operator

A business that runs one or more physical mailbox locations. The platform is
multi-operator: mailboxes in different cities may be run by different
companies, and a customer can rent from several of them.

Key fields: name, contact info, settings that act as defaults for its
locations (retention days, pricing).

### Location

A physical street address operated by one Operator, containing rentable
mailboxes. Key fields: operator, street address, city, timezone.

### Mailbox

A rented box: the link between one Customer and one Location, with a box
number and a Plan. This is the billing anchor — fees attach to the mailbox.

Key fields: customer, location, box number, plan, status
(`ACTIVE`/`CLOSED`), openedAt/closedAt.

### Plan

Pricing and limits attached to a mailbox: monthly fee, included recipient
count, extra-recipient fee, retention days (default 30), hold pricing,
scan/forward pricing.

### Recipient

A name or company name allowed to receive mail at a mailbox. Every mailbox
has at least one (the customer's own name); extras beyond the plan's included
count are billable. Incoming mail is matched to a recipient at intake.

### MailItem

One piece of physical mail. The central entity of the system.

Key fields: mailbox, recipient, receivedAt, type (letter / large envelope /
package), envelope photo, `status` (see state machine below),
`retentionExpiresAt` (receivedAt + plan retention days, extended by holds).

### MailItemEvent

Append-only audit trail: every request and every fulfilment writes an event
with actor (user id), action, and timestamp. Required for trust and legal
reasons — items get opened and destroyed on customer instruction, so "who did
what when" must always be answerable.

### Scan / Forward / ForwardingAddress

- **Scan**: uploaded document(s) for a fulfilled open-and-scan request.
- **Forward**: fulfilment record of a forward request — destination, carrier,
  tracking number, shippedAt.
- **ForwardingAddress**: a customer's saved destination addresses.

## MailItem state machine

Customer clicks create _requests_; staff fulfilment moves the item to a
terminal or stable state. Physical reality is the source of truth.

```
                        ┌──────────────► SCAN_REQUESTED ───► SCANNED ─┐
                        │                                             │  (scanned items still
             intake     │                                             │   exist physically:
  (staff) ──────────► RECEIVED ────────► FORWARD_REQUESTED ─► FORWARDED   scan does not stop
                        │                                                 the retention clock)
                        ├──────────────► SHRED_REQUESTED ──► SHREDDED
                        │                      ▲
                        │   retention expires  │
                        └──────────────────────┘
                            (unless HOLD is active — hold pushes
                             retentionExpiresAt out; paid by customer)
```

- **RECEIVED** — logged at intake, envelope photographed. Customer sees it.
- **SCAN_REQUESTED / SHRED_REQUESTED / FORWARD_REQUESTED** — customer has
  asked; the item sits in the staff fulfilment queue.
- **SCANNED** — contents uploaded and readable in the panel. The physical
  item still exists, so it can subsequently be shredded or forwarded, and the
  retention clock keeps running.
- **FORWARDED / SHREDDED** — terminal. Forwarded records tracking; shredded
  records who destroyed it and when.
- **Auto-shred** — when `retentionExpiresAt` passes with no active hold, the
  system moves the item to `SHRED_REQUESTED` (flagged as system-initiated);
  staff perform and confirm the physical shred as usual.

Invariants worth enforcing in code:

1. Only staff/admin actions may set `SCANNED`, `FORWARDED`, `SHREDDED`.
   Customer actions may only set `*_REQUESTED` states and holds.
2. Terminal states never transition again.
3. Every transition writes a `MailItemEvent`.
4. A mailbox can only close when it has no items outside terminal states.

## Open questions

Decisions not yet made — resolve before building the affected area, and
record the answer here:

- **Operator self-service vs. platform-managed**: do operators get their own
  admin panel (operators as tenants), or does the platform admin configure
  operators centrally? Affects how `ADMIN` is scoped.
- **Scan storage**: local disk vs. S3-compatible object storage; scan
  retention after item shredded (keep the PDF forever? plan-dependent?).
- **Payments provider** (likely Stripe) and whether metered actions are
  prepaid credits or end-of-month invoicing.
- **Packages**: same lifecycle as letters, or excluded from scan/shred (you
  don't shred a parcel) with pickup/forward only?
