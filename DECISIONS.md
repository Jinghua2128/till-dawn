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

## DEC-GLASS-20261010 — Liquid-glass surface treatment

- User requested a liquid-glass effect. Apply it to existing navigation, controls, consultation surfaces and dialogs while preserving the cream/rose palette, original artwork, typography, visible copy and page flows.
- Implement shared CSS blur, translucency, specular edges and restrained hover feedback. Keep opaque fallbacks, reduced-transparency support, reduced motion and keyboard focus; no new runtime dependency.
- User reports the requested Vercel account step complete; verify staging normally while retaining all-deployment protection.

## DEC-ACCOUNT-20261011 — Vercel account selection

- User identified `LongMai2128` as the Vercel account connected to GitHub `Jinghua2128`. Normal CLI sign-in completed and now reports `longmai2128`; access to the existing Till Dawn project was verified.
- Reuse the existing project and all-deployment protection. Do not create duplicate resources or change Git authorship to work around access checks. MCP project scope remains separately unverified.

## DEC-SIMPLE-20261112 — Minimal UI and bounded AI

- User requests direct labels, no slogans or redundant hints, aligned layout, restrained motion and Apple-like corners while preserving the current visual direction. Use shared CSS and existing Motion, with reduced-motion and rounded-corner fallbacks; no added UI dependency.
- Prefer DeepSeek-V4.1-Flash-1017 for evaluation. Start with verified catalogue retrieval and server validation, not fine-tuning or an autonomous agent. API privacy terms must be confirmed before real customer data is sent. Training cannot guarantee no exposure or misuse.
- User explicitly requested GitHub publication and automatic viewing of updates. Reuse the private `Jinghua2128/till-dawn` repository and existing protected Vercel project; keep all-deployment authentication.
- Apply the Next.js 16.4.6 patch before release to resolve the verified runtime advisories affecting 16.4.0. No general dependency upgrade.
