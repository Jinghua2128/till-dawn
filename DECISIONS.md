# DECISIONS — Till Dawn

## DEC-SETUP-20261009 — Durable project handoff

- Date / status: 2026-10-09 — Active.
- Decision: adopt the supplied Codex handoff workflow across projects, with global working rules and independent state at each project root.
- Reason: the user requested “set it up for all projects.”
- Consequences: maintain HANDOFF.md at meaningful checkpoints; keep verified paths, durable decisions and evidenced failures in their respective records. Preserve existing instructions, historical context and all project files.
- Scope: workflow installation does not resume past implementation tasks, authorize publishing, or certify application behavior.
- Related: [HANDOFF.md](HANDOFF.md), [PROJECT_MAP.md](PROJECT_MAP.md).

## Existing project decisions

Preserve and consult existing project history rather than copying or overriding it:

- [docs/09-decisions-risks-sources.md](docs/09-decisions-risks-sources.md) — existing context; consult before related work.
- [docs/07-delivery-backlog.md](docs/07-delivery-backlog.md) — existing context; consult before related work.
- [docs/08-catalogue-data-handoff.md](docs/08-catalogue-data-handoff.md) — existing context; consult before related work.
- [HANDOFF.md](HANDOFF.md) — prior history, where present, remains intact.

Record future substantive decisions with date, status, reason, consequences and affected paths. Mark superseded decisions explicitly; do not erase history.

## DEC-M1-20261009 — Authorized implementation and hosting

- User approved Milestone 1 with “Begin” and authorized creating the GitHub repository and Vercel project. Scope is UI prototypes, CI, protected staging; later milestones retain separate gates.
- Confirmed: customer accounts with saved history are required; initial catalogue input is names and retailer links only. Preserve the richer evidence requirements in the existing catalogue handoff.
- User explicitly asked to fetch and follow `https://vercel.com/get-started.md`: global CLI, user-scoped official plugin, shared MCP endpoint and user-completed OAuth were set up. MCP mutation approvals remain required.
- Prototype state stays in page memory; catalogue and AI are honestly unavailable. No real products, claims or prices are invented.
- Runtime stack is pinned Next 16.4/React 19.3, local fonts, original decorative assets. Build/CI/Vercel use Node 24; local command execution used Node 26.

## DEC-HOST-20261009 — All deployment URLs require sign-in

- Explicit user approval: “Protect all deployments,” after being informed that Vercel promoted the first requested preview to production.
- Applied `ssoProtection.deploymentType = all`; signed-out checks returned 302 for both production aliases and the immutable URL. Keep protection enabled until the user authorizes public launch.
