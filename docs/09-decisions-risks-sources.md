# Decisions, risks and evidence

## Confirmed inputs

- The initial assignment is planning before implementation, followed by owner approval and incremental milestones.
- Required stack, Singapore launch, two product kinds, 60–80 parents, external shopping, catalogue-grounded AI and future avatar/voice service reuse are fixed by the brief.
- **Owner reply:** customer accounts with saved history are required. This is incorporated into scope, schema, page inventory, tests and estimate.
- **Owner reply:** the teammate initially has product names and retailer links only. Intake/enrichment and its workload are part of the plan; those links are not verified catalogue metadata.
- No Pinterest images were supplied with the text attachment. Visual direction remains provisional pending those references or explicit approval of the written-direction concepts.

## Decisions before development or the relevant milestone

Defaults below are proposals, not inferred consent. The owner can approve this register as a batch with amendments; no credentials need to be pasted into chat.

| ID | Decision | Proposed default | Owner / deadline | Effect if unresolved |
|---|---|---|---|---|
| D01 | Customer access flow | Optional guest exploration; email link/OTP accounts to save and resume. Accounts/history themselves are already confirmed. | Owner / before M1 | Auth UX and persistence boundaries change |
| D02 | Saved-history policy | Explicit Save; temporary sessions 24 h, saved sessions 90 days inactivity; delete controls; no transcript admin dashboard | Owner / before M2 | Retention, consent copy and cleanup cannot be finalized |
| D03 | Catalogue taxonomy and pilot | Five skincare and six makeup subtype codes; 8–12 varied pilot parents; both categories represented | Owner + teammate / Week 1 | Schema/normalization and matching lack representative evidence |
| D04 | Evidence and ingredient policy | Human-verified sources, complete/current applicable INCI for exclusions, unknown never proves absence | Owner + teammate / before M2 | Cannot guarantee the intended constraint behavior |
| D05 | Price/availability rules | Price ≤7 days; stock ≤24 h; item budget includes verified GST, excludes delivery; missing price cannot meet a hard cap | Owner + teammate / before M3 | Pricing UI, filters and ongoing review workload change |
| D06 | Catalogue recheck owner | Teammate owns source/stock/price/image-rights review; engineer supplies reminders | Team / before M2 | Stale data degrades usable recommendations |
| D07 | Visual approval and assets | Approve supplied written palette and provisional concept direction, then incorporate missing Pinterest references before screen lock; commercially licensed real product images | Owner / before M1 design lock | Visual fidelity/asset work may need revision |
| D08 | LLM provider/model and daily cap | Evaluate one schema-capable provider; deterministic adapter and fallback; provider terms reviewed; fixed daily spend admission cap | Owner / before M4 | Live AI stays disabled; no assumed vendor price/retention |
| D09 | Hosting/Auth/email accounts | Separate staging/production Supabase and Vercel; Singapore placement where offered; verified sender/domain for sign-in email | Owner / before M2/M4 | Live account and deployment tests blocked |
| D10 | Business identity and legal contact | Actual operating entity, support/privacy contact, documented vendor transfers, retention and affiliate language | Owner/teammate / before M5 publication | Legal/contact pages cannot be published accurately |
| D11 | Affiliate/retailer permissions | Ordinary links first; approved exact merchant/affiliate hosts; disclosure; no sponsored organic ranking | Teammate / before offer publication | Affiliate usage blocked, ordinary approved links can proceed |
| D12 | Beta timing and scope | Eight-week attempt, reforecast after Week 2; 296 h base plus 40–56 h contingency; no critical test cuts | Owner / before implementation | Six-week date remains unsupported |
| D13 | Beta audience and capacity | Small invite-only cohort; English, SG/SGD, 10 concurrent consultations test target; define age eligibility with business/privacy review before launch | Owner / before beta | Admission rules and usability evaluation lack a target |
| D14 | Roles | Owner role plus editor role; admin MFA for writes; customer accounts never imply staff role | Owner / before M2 | Provisioning and role access tests undefined |

Suggested approval wording: “Approve this planning baseline with [amendments], and proceed with Milestone 1.” Approval does not authorize inventing missing product data, scraping, or implementing deferred features. The implementation pause is requested by the user's initial assignment, not imposed by a skill.

## Major risks and mitigations

| Risk | Impact | Mitigation and trigger |
|---|---|---|
| Names/links lack formula, shade and offer facts | Largest catalogue readiness risk; no safe exclusions or variant prices | Verify the pilot before locking import rules; if fewer than 20 verified parents at Week 2, reforecast launch |
| Image rights are unavailable | Attractive UI cannot legally rely on the desired asset set | Request authorised brand assets early; hide affected products until a legitimate image path is approved |
| Saved accounts expand original scope | More security/email/retention work; schedule risk | Track the account increment separately; resolve provider/redirect/transfer path in M2, not final week |
| Sparse ingredient/shade metadata | Low eligible coverage and frequent no-match | Report data gaps; do not compensate with LLM guesses; target curation to high-demand categories |
| Prices/availability change | Users may see obsolete observations | Timestamp labels, configurable expiry, recheck queue, unknown state and final retailer authority |
| Hallucinated facts or injection | Damages trust or changes constraints | Typed tools, shortlist/evidence validation, bounded explanation templates, adversarial tests, kill switch |
| RLS/view/service-key mistake | Private chats/admin data exposed | Direct-access tests, owner predicates, safe projections, narrow privileged module, no client secrets |
| Guest-to-account transfer bug | History attached to wrong user | Dual ownership proof, one-use grant, transactional claim and dedicated isolation tests |
| Shared caching of session content | Cross-user data exposure | Dynamic/private no-store paths and cache-isolation regression tests |
| Provider/email outage or abuse | Consultation/login unavailability or spend surge | Deterministic fallback, durable quotas, deadline/budget reservations, email abuse protection and visible retry |
| Over-designed visual scope | Six-week beta slips | Approve restrained reusable design system; defer extra art/motion and advanced dashboard features |
| Cross-border vendor processing | Privacy notice/obligations incomplete | Document actual providers and locations/terms, retention and contact; do not infer compliance from Singapore hosting |

## Architecture decisions

- Modular monolith over microservices: fewer deployment boundaries, one transaction model, appropriate to one engineer and the initial catalogue size.
- PostgreSQL deterministic retrieval before LLM explanation: auditable hard constraints and reproducible tests; no vector search needed for 60–80 parents.
- Parent → variant → offer model: prevents shade duplication and mismatched prices; variant-scoped ingredient sets handle formula differences.
- Evidence records for selected factual fields: traceable explanations without turning every product attribute into an unrestricted key/value system.
- Technical anonymous identity plus optional customer account: guest usability with database ownership controls; saved histories are private and explicitly persisted.
- Provider adapter and five read-only tool contracts: future interaction clients reuse logic; current beta remains text only.
- Counter tables and scheduled cleanup in the existing database: avoid introducing another stateful service for modest beta traffic; revisit only with measured load.

## Sources consulted

Consulted 8 October 2026. These references support platform/security/accessibility facts; the product scope, freshness windows, ranking weights, retention numbers, cost limits and workload are **proposed design decisions**, not vendor guarantees or legal determinations.

| Source | Relevance |
|---|---|
| [Next.js data security](https://nextjs.org/docs/app/guides/data-security) | Server-only data boundaries and per-entry-point authorization |
| [Next.js Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route) | HTTP request/response and streaming interface |
| [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) | Row policies, grants, public/private roles, view and service-key considerations |
| [Supabase anonymous sign-ins](https://supabase.com/docs/guides/auth/auth-anonymous) | Internal guest identity uses authenticated role; session/cache behavior needs care |
| [Supabase database functions](https://supabase.com/docs/guides/database/functions) | Function privilege model and fixed search paths |
| [Vercel regions](https://vercel.com/docs/regions) | Singapore function region availability; confirm project settings at deployment |
| [Vercel Functions](https://vercel.com/docs/functions) | Server execution, querying and streaming capabilities |
| [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Accessibility target and interaction/contrast criteria |
| [PDPC data protection obligations](https://www.pdpc.gov.sg/overview-of-pdpa/the-legislation/personal-data-protection-act/data-protection-obligations) | Singapore data protection planning, including retention and overseas transfer considerations |

No real product facts, medical claims, commercial price quotes, provider-cost estimates or image licences were inferred from these sources. Product evidence must come from the teammate's verified catalogue workflow.
