# PROJECT_MAP — Till Dawn

Updated from implementation and deployment checks: 2026-11-12. Original workflow inventory: 11:30 SGT. Root: `/Users/longmai2128/Documents/Till Dawn`.

## Identity and entry points

- Type: Next.js App Router / React / TypeScript application; manifest pins Next.js 16.4.6 and React 19.3.0.
- Branch: `main`; implementation baseline: `6d8012ec17dbdde1349eb9d5077a846288a09fdc`. Latest pushed implementation is `c7d1761` (liquid-glass rendering refinement); see HANDOFF.md for current local changes and the failed historical Linux CI result.
- Open/run: `npm run dev` (documented Node 24 / npm setup); inspect README.md first.
- Path inventory and the implementation map below describe inspected files. Executed check results and remaining integration limits are in HANDOFF.md.

## Canonical locations

| Path | Purpose | Verification scope |
| --- | --- | --- |
| `src/` | Application source; src/app/page.tsx and layout.tsx are present. | Inspected for Milestone 1; see implementation map |
| `public/` | Public assets; preserve references and provenance. | Inspected for Milestone 1; see implementation map |
| `docs/` | Existing requirements, architecture, delivery and design records. | Inspected for Milestone 1; see implementation map |
| `tests/` | Browser tests under tests/e2e. | Inspected for Milestone 1; see implementation map |
| `package.json` | Runtime versions and available commands. | Inspected for Milestone 1; see implementation map |
| `package-lock.json` | npm dependency lockfile. | Inspected for Milestone 1; see implementation map |
| `README.md` | Project setup, current scope and documented prior checks. | Inspected for Milestone 1; see implementation map |
| `AGENTS.md` | Root workflow / memory record | Preserved and maintained at the project root |
| `HANDOFF.md` | Root workflow / memory record | Preserved and maintained at the project root |
| `PROJECT_MAP.md` | Root workflow / memory record | Preserved and maintained at the project root |
| `DECISIONS.md` | Root workflow / memory record | Preserved and maintained at the project root |
| `FAILURE_LOG.md` | Root workflow / memory record | Preserved and maintained at the project root |

## Available commands

- `npm run dev`: local Next server on 127.0.0.1:3000; browser review completed.
- `npm run check`: lint, typecheck and production build; PASS in implementation CI.
- `npm run lint`, `npm run typecheck`, `npm run build`: also PASS locally; build needed approved execution outside the sandbox.
- `npm run test:e2e`: production-server Playwright suite; all 12 cases PASS locally; current remote CI status is in HANDOFF.md.
- `npm run start`: Next production server bound to 127.0.0.1; used by Playwright on port 3100.
- `npm audit --omit=dev`: runtime dependency audit; zero advisories at verification.
- Node 24 is the configured CI/Vercel version; local checks used Node 26. Exact check scope and limitations remain in HANDOFF.md.

## Existing context to preserve

- [docs/09-decisions-risks-sources.md](docs/09-decisions-risks-sources.md) — existing context; consult before related work.
- [docs/07-delivery-backlog.md](docs/07-delivery-backlog.md) — existing context; consult before related work.
- [docs/08-catalogue-data-handoff.md](docs/08-catalogue-data-handoff.md) — existing context; consult before related work.

## Protected paths and conventions

- Preserve src/, public/, docs/concepts/, lockfile and existing local environment files. Do not copy environment values into documentation.
- Place new files in established locations and match existing naming. Keep these five workflow files at the root.
- Generated outputs and caches are not automatically disposable. No cleanup, relocation or deduplication was performed or approved by this setup.
- This is a concise root inventory. Nested entry points, asset references, duplicate candidates and full dependency relationships require task-specific inspection.

## Implementation map — inspected during Milestone 1

- `src/app/layout.tsx`: metadata, local fonts, skip link, Motion provider. `globals.css`: shared palette, typography, responsive layouts and liquid-glass tokens/surfaces with accessibility fallbacks. Blur is limited to navigation and standalone controls outside open dialogs; nested controls and full-page reading surfaces avoid redundant filters.
- `src/app/page.tsx`: landing, links and three original images from `public/images/`. `src/app/consultation/page.tsx`: query validation and consultation shell; `?preview=1` exposes developer state examples.
- `src/features/consultation/`: page-memory client, conditional preferences, display labels and honest recommendation states.
- `src/app/products/page.tsx`: category navigation/empty catalogue. `sign-in/`, `account/history/`: unavailable-feature pages. `[info]/`: privacy/terms/disclosure/contact allowlist. `error.tsx`, `not-found.tsx`: recovery destinations.
- `src/components/ui/`: official shadcn primitives with theme, target-size and InputGroup disabled-state adjustments. Shared header/footer/navigation under `src/components/`.
- `tests/e2e/preview.spec.ts`, `playwright.config.ts`: production-server browser tests, Chromium desktop and mobile WebKit, accessibility/overflow checks. Generated traces/screenshots go to OS temp.
- `.github/workflows/ci.yml`: pinned official Actions, Node 24, lint/typecheck/build and Playwright. `vercel.json`: Next.js, npm ci, sin1; `.vercelignore`: excludes planning/root handoff records, tests and environment files from CLI uploads (except `.env.example`).
- `docs/concepts/`: approved reference images and asset provenance. `docs/01`–`10`: canonical requirements/design/architecture/backlog records; types are specifications, not a database implementation.
- `.env.local`, `.vercel/`, `.next/`, `node_modules/` are generated/private/ignored. No relocation or cleanup authorized.
- The original workflow setup performed an inventory only. Current executed checks and hosting/CI limitations are recorded in HANDOFF.md. Root state files are committed project records but excluded from deployment uploads.
