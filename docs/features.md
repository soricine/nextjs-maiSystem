# Feature Reference

The authoritative list of what the product does, grouped by role. Use this to
scope work: a change that doesn't serve one of these features probably doesn't
belong in the project.

Status legend: ✅ implemented · 🔶 partially implemented · ⬜ planned

## Customer features

### Inbox

- ⬜ List all mail items across the customer's mailboxes, newest first, with
  envelope photo, received date, addressed-to name, and current status.
- ⬜ Filter by mailbox, by recipient, and by status (new, scan requested,
  scanned, forwarded, shredded, held).
- ⬜ View a single item: envelope photo, scan (once available), full action
  history.
- ⬜ Show days remaining until auto-shred on every unresolved item.

### Actions on a mail item

- ⬜ **Request open & scan** — staff open the envelope and upload a scan; the
  customer then reads it in the panel.
- ⬜ **Request shred** — staff destroy the item. Irreversible once fulfilled;
  the UI must confirm before submitting.
- ⬜ **Request forward** — customer picks (or enters) a physical destination
  address; staff mail the item and record the carrier/tracking number.
- ⬜ **Request hold** — pay to keep the physical item on-site beyond the
  retention window instead of it being auto-shredded.

### Mailboxes

- ⬜ See all rented mailboxes (address, operator, plan, status) under one login.
- ⬜ Rent an additional mailbox at any operator location on the platform.
- ⬜ Close a mailbox (remaining mail must be resolved first: forwarded or
  shredded).

### Recipients

- ⬜ Add extra names or company names that may receive mail at a mailbox.
- ⬜ The plan includes N recipients; adding more than N incurs a per-recipient
  fee, shown before confirming.
- ⬜ Remove a recipient (mail already received for them is unaffected).

### Account

- ✅ Sign up, log in, log out (dual-JWT: auth + refresh tokens, see
  `docs/architecture.md`).
- ✅ Change password (revokes all other sessions).
- ✅ Reset password via emailed 6-digit OTP (Resend).
- ✅ Delete account (password-confirmed, cascades to sessions/OTPs).
- 🔶 Dashboard welcome page (`/dashboard`); profile details beyond name/email
  not yet built.
- ⬜ Manage forwarding addresses (saved destinations).
- ⬜ Payment methods, plan selection, invoices.
- ⬜ Notifications (email) when new mail arrives or a request is fulfilled.

## Operator staff features

Staff work at a physical location and are the hands of the system: nothing a
customer requests happens until a staff member does it and records it.

### Intake

- ⬜ Log a new mail item: photograph the envelope, assign it to a mailbox and
  recipient (match the addressed-to name against the mailbox's recipient
  list), record received date and mail type (letter, large envelope, package).
- ⬜ Flag unmatchable mail (no such recipient at that mailbox) for review /
  return-to-sender.

### Fulfilment queue

- ⬜ See pending customer requests at their location, oldest first:
  items to open & scan, items to shred, items to forward.
- ⬜ Fulfil a scan request: upload the scanned document, mark the item scanned.
- ⬜ Fulfil a shred request: mark the item shredded (records who and when).
- ⬜ Fulfil a forward request: record carrier and tracking number, mark
  forwarded.
- ⬜ See items nearing or past their retention date for auto-shred processing.

### Account

- ⬜ Staff log in and see a staff-only area (legacy NextAuth shell removed;
  rebuild on the JWT auth stack).
- ⬜ Staff dashboard.

## Admin features

- ⬜ Log in to an admin-only area (legacy NextAuth shell removed; rebuild on
  the JWT auth stack).
- ⬜ List, create, and delete customer accounts ("members").
- ⬜ List and manage staff accounts.
- ⬜ Manage operators and their locations (address, hours, contact).
- ⬜ Manage plans and pricing: monthly mailbox fee, included recipients,
  extra-recipient fee, retention window (default 30 days), hold pricing,
  scan/forward pricing.
- ⬜ Scope staff accounts to an operator/location (today staff are global).
- ⬜ Platform-level reporting: mailboxes, volume, revenue.

## System (no user in the loop)

- ⬜ **Retention clock**: each physical (non-resolved) item auto-shreds
  `retentionDays` (default 30) after receipt unless a hold is active. The
  system doesn't destroy anything itself — it moves the item into the staff
  shred queue when the clock expires.
- ⬜ Billing engine: recurring mailbox fees, metered charges (extra
  recipients, holds, forwards, scans depending on plan).
- ⬜ Audit log: every status change on a mail item records actor, action, and
  timestamp. Legally significant (customers' mail is being opened and
  destroyed on their instruction) — never skip it.
