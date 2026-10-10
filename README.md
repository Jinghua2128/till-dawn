# Till Dawn

**Milestone 1 · UI foundation · 9 October 2026**

A Singapore-first beauty discovery platform built incrementally with Next.js App Router, React, TypeScript, Tailwind, shadcn/ui and Motion.

## Current scope

The landing page, responsive navigation, consultation UI, editable conditional preferences, message composer, confirmation dialogs, and empty/loading/error examples are implemented. Catalogue, account and history destinations explain their upcoming functionality.

This is a design and interaction preview. Messages live only in page memory. Customer authentication, saved history, the verified catalogue, Supabase, and AI recommendations are later milestones. No products, prices, shades or AI responses are fabricated.

## Run and verify

Use Node 24 (`.nvmrc`) and npm. No application secrets are required for this milestone.

```sh
npm ci
npm run dev
```

The app runs at http://127.0.0.1:3000. For production and browser checks:

```sh
npm run check
npx playwright install chromium webkit
npm run test:e2e
```

The browser suite starts the production build on port 3100. Its 12 cases cover desktop Chromium (1440×1000), mobile WebKit (390×664 viewport with iPhone 13 emulation), and 320px narrow-layout checks. It exercises navigation, conditional preferences, cancel/apply focus, message entry and deletion, refresh clearing, and loading/error recovery, with axe accessibility checks. Screenshots/traces on failure are saved in the OS temporary directory, outside the repository.

GitHub Actions runs lint, strict type checking, a production build, and the same browser suite for main pushes and pull requests. Dependencies and Actions releases are pinned. [Implementation CI run 37880036070](https://github.com/Jinghua2128/till-dawn/actions/runs/37880036070) passed for commit `6d8012e`; [documentation checkpoint run 37887891373](https://github.com/Jinghua2128/till-dawn/actions/runs/37887891373) also passed for `f8d80a6`.

Validated locally: lint, type check, production build, and all 12 browser tests pass. `npm audit --omit=dev` reports no known runtime dependency advisories. The development-only ESLint/shadcn dependency chain still reports the braces nested-pattern advisory (no patched braces version was available at verification); do not run these tools over untrusted projects.

## Hosting

Private repository: https://github.com/Jinghua2128/till-dawn

Vercel project: https://vercel.com/longmai2128s-projects/till-dawn

The workspace is linked to this project. It uses Next.js, Node 24, `npm ci`, and Singapore (`sin1`) for server functions. Vercel Authentication protects **all deployments**, including production URLs, as explicitly approved by the owner. The site also sends `noindex, nofollow`; this does not replace access protection.

[Protected UI review deployment](https://till-dawn-8t1bc52zx-longmai2128s-projects.vercel.app): Vercel promoted the first upload to production even though the CLI requested preview. This deployment is Ready, and authenticated checks of `/` and `/consultation` returned HTTP 200 with the expected app content. Signed-out requests redirect to Vercel sign-in. It is a UI prototype, not a launched beta.

The separate preview deployment `dpl_71ofeJW1s4M8RoTpTcySH3UTxZSv` is **Blocked** because Vercel cannot authorize the Git commit author. The next step is to link GitHub account `Jinghua2128` to the existing project owner's Vercel account in [Authentication settings](https://vercel.com/account/authentication), following [Vercel's collaboration guidance](https://vercel.com/docs/deployments/troubleshoot-project-collaboration), then retry `vercel deploy --target preview --scope longmai2128s-projects`. Verify the returned target and Ready state before treating it as staging.

Environment files, Vercel credentials, generated builds and dependencies are excluded from Git. `.vercelignore` additionally excludes planning/handoff documents and tests from CLI uploads. Git integration is not connected; GitHub CI passes independently, but automatic Vercel deployment is not configured.

The requested agent setup installed Vercel CLI 63.1.0, the official user-scoped Vercel plugin, and the shared MCP endpoint with user-completed OAuth. CLI project access works. The currently exposed MCP project tools still return a scope authorization error; the user subsequently installed the Vercel app/plugin, but fresh project/user reads still returned 403/404. MCP project access remains unresolved; the CLI continues to work.

## Design implementation

The 10 October liquid-glass refinement adds translucent, blurred surfaces, reflective edges, soft shadows and glossy controls to the existing navigation, consultation and dialogs. Shared tokens live in `src/app/globals.css`; it includes opaque fallbacks, reduced-transparency/forced-colors handling and reduced-motion support. The mobile sticky composer keeps an opaque backing so text cannot show through its controls. No new dependency, copy, artwork or workflow was introduced.


The landing layout preserves the approved serif typography, cream/rose palette, architectural hero, category diptych and editorial spacing. The responsive mobile layout separates artwork from controls. The consultation keeps the preference sidebar, chat and recommendation region; on mobile, preferences open in an accessible dialog. The backdrop and save banner reuse the original hero artwork. Explicit preview notices replace the concept’s implied live assistant and account saving. Original assets and prompts are in [the provenance record](docs/concepts/production-assets.md).

## Review guide

| Deliverable | Document |
|---|---|
| 1. Requirements review and 2. finalized PRD | [Product requirements](docs/01-product-requirements.md) |
| 3. PostgreSQL schema, constraints, RLS, ER diagram | [Architecture and database](docs/02-architecture-database.md) |
| 4. TypeScript domain types | [Domain contracts](docs/03-domain-contracts.ts) |
| 5. Questionnaire branching and 6. matching algorithms | [Questionnaire and recommendations](docs/04-questionnaire-recommendations.md) |
| 7. AI function calling and server API contracts | [AI and API contracts](docs/05-ai-api-contracts.md) |
| 8. Complete page structure and design system | [Design and page specification](docs/06-design-page-specification.md) |
| 9. Prioritized backlog and 10. workload/critical path | [Delivery plan and acceptance tests](docs/07-delivery-backlog.md) |
| 11. Exact teammate data requirements | [Catalogue handoff](docs/08-catalogue-data-handoff.md) |
| 12. Decisions before development | [Decisions, risks, and sources](docs/09-decisions-risks-sources.md) |

Visual review: [landing overview](docs/concepts/landing-overview-v1.png) and [consultation with saved-history controls](docs/concepts/consultation-v2.png). Generated with built-in ImageGen; [prompts and provenance](docs/concepts/README.md) are included. The implementation follows these concepts with responsive adjustments and explicit preview notices.

[Planning review record](docs/10-planning-review.md) preserves checks from the planning stage. [HANDOFF.md](HANDOFF.md) records current implementation verification, deployment state and the exact resume action; [PROJECT_MAP.md](PROJECT_MAP.md) maps the code and assets.

## Planning baseline

- **Confirmed by the owner:** customer accounts with saved consultation history are included. Proposed access model: guest browsing/temporary consultation plus optional email sign-in to save and resume across devices. Supabase Auth provides both customer and admin identities; only an explicit admin role grants catalogue access.
- **Confirmed starting data:** product names and retailer links only. These enter a private intake queue and require enrichment/evidence before publication. The teammate's curation is a critical-path dependency.
- Questionnaire and chat share one validated preference model and recommendation pipeline.
- Hard constraints apply to individual variants and their offers. Ranking returns distinct parent products, with eligible variants attached.
- Ingredient uncertainty cannot satisfy an ingredient exclusion. A missing or stale price cannot satisfy a strict price ceiling.
- The LLM extracts preferences and helps explain evidence; PostgreSQL and server rules decide eligibility, order, product identities, links, and prices.
- Commercial relationships never silently influence organic rankings. The beta can use ordinary retailer links before affiliate approval.
- Build in six verified milestones. Milestone 1 is authorized. Baseline engineering effort is **296 hours**, including **24 hours** for customer accounts/saved history, plus **40–56 hours** contingency. Six weeks is a stretch beta target; the full allowance is **336–352 hours**, or **8.4–8.8 weeks at 40 hours/week**. Catalogue curation is additional teammate work. An eight-week date needs a lean execution path or an agreed scope tradeoff.
