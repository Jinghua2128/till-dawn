# Till Dawn

**UI preview · updated 12 November 2026**

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

GitHub Actions runs lint, type checking, production build and the browser suite for main pushes and pull requests. Current verification and hosting status are recorded in [HANDOFF.md](HANDOFF.md).

Next.js is pinned to 16.4.6. Local checks and all 12 browser tests pass; `npm audit --omit=dev` reports zero runtime advisories. Development dependencies still have advisories; they were not broadly upgraded.

Developer loading/error examples are available at `/consultation?preview=1`; they stay out of the normal consultation flow.

## Hosting

[View Till Dawn](https://till-dawn-eight.vercel.app) · [Private GitHub repository](https://github.com/Jinghua2128/till-dawn) · [Vercel project](https://vercel.com/longmai2128s-projects/till-dawn)

Successful pushes to `main` automatically update the permanent Vercel URL. Sign in with Vercel to view it: all deployments remain protected, as requested. This is the UI preview; customer accounts, saved history and live AI are not connected.

The project uses Next.js, Node 24 and `npm ci`. GitHub Actions runs lint/typecheck/build and all 12 browser tests with one CI worker for stable Linux WebKit execution. [Verified source CI](https://github.com/Jinghua2128/till-dawn/actions/runs/43233522101) passed without retries. Protected deployment content and signed-out redirects were checked on 12 November.

Environment files, credentials, builds and dependencies are excluded from Git. Root planning/handoff records and tests are also excluded from CLI deployment uploads. Current evidence and any remaining limitations are in [HANDOFF.md](HANDOFF.md). The [AI plan](docs/05-ai-api-contracts.md) explains the proposed DeepSeek integration and privacy requirements.

## Design implementation

The 10 October liquid-glass refinement adds translucent, blurred surfaces, reflective edges, soft shadows and glossy controls to the existing navigation, consultation and dialogs. Shared tokens live in `src/app/globals.css`; it includes opaque fallbacks, reduced-transparency/forced-colors handling and reduced-motion support. Blur is limited to smaller navigation/control surfaces outside open dialogs; nested controls and full-page reading surfaces avoid redundant filters. The mobile sticky composer keeps an opaque backing so text cannot show through its controls. The November refinement removes slogans, promotional sections and duplicate hints, and adds shared motion timings, native squircle corners with a rounded fallback, and reduced-motion handling. No additional UI dependency or artwork was needed.


The landing layout preserves the approved serif typography, cream/rose palette, architectural hero, category diptych and editorial spacing. The responsive mobile layout separates artwork from controls. The consultation keeps the preference sidebar, chat and recommendation region; on mobile, preferences open in an accessible dialog. The consultation backdrop reuses the original hero artwork. Explicit preview notices replace the concept’s implied live assistant and account saving. Original assets and prompts are in [the provenance record](docs/concepts/production-assets.md).

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
