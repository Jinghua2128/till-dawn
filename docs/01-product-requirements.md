# Product requirements document

**Status:** proposed finalized MVP baseline, pending approval. **Market:** Singapore. **Language:** English. **Display currency:** SGD. **Version:** 1.0, 8 October 2026.

## Product outcome

Help a visitor turn cosmetic preferences into a short, understandable list of catalogue products and confidently inspect variants and retailer options. Trust depends on traceable facts, honest uncertainty, and transparent commercial links—not diagnoses, match percentages, or invented product attributes.

The product owner implements design, frontend, backend, data integration, testing, and deployment. The teammate supplies and verifies product information, imagery permissions, retailer relationships, and business feedback. Catalogue preparation runs alongside engineering and has its own acceptance gate.

## Audience and core jobs

| User | Job | Successful outcome |
|---|---|---|
| Skincare shopper | Find a product type meeting texture, cosmetic-goal, ingredient, and budget preferences | Understands why eligible products were selected and what is unverified |
| Makeup shopper | Find a formula, coverage, finish, and optional shade family | Compares parent products and only sees supported shade suggestions |
| Explorer | Browse before describing preferences | Can filter, inspect products, and enter chat without onboarding |
| Catalogue editor | Maintain reliable product, variant, and offer data | Imports drafts, resolves validation errors, verifies evidence, and publishes deliberately |
| Owner | Evaluate beta quality and operate within budget | Sees aggregate usage, no-match reasons, provider failures, and outbound clicks |

## Scope and priorities

All P0 items are required for the controlled beta. P1 items improve the experience but can follow beta admission if schedule pressure arises.

| ID | Priority | Requirement and acceptance |
|---|---|---|
| PR-01 | P0 | Landing page explains catalogue-based discovery and offers consultation and browse actions; neither requires a customer account. |
| PR-02 | P0 | Catalogue starts with 60–80 verified parent products across skincare and makeup. Sizes/shades are variants, not duplicated parent entries. A smaller curated set may be used only for an explicitly approved private alpha. |
| PR-03 | P0 | Skincare supports cleanser, moisturizer, serum, sunscreen, toner; makeup supports foundation, concealer, blush, lip products, mascara, eye makeup using extensible controlled category codes. |
| PR-04 | P0 | Shared optional questionnaire offers skincare/makeup/both/exploring, 4–7 relevant steps, skip/back/edit, progress, and direct chat. |
| PR-05 | P0 | Text consultation supports streamed responses, current-session history, suggested questions, follow-ups, cards, stop/retry, expiration, loading, and error states. |
| PR-06 | P0 | One server recommendation service accepts structured questionnaire preferences or validated chat intent; gives approximately 3–5 distinct parents when enough eligible candidates exist. Never pads with ineligible products. |
| PR-07 | P0 | Catalogue includes text search, brand, SGD price, category-specific filters, and deterministic sorting. Unknown data and empty results are visible. |
| PR-08 | P0 | Product details include supported attributes, ingredients/completeness, variants, current offer observations, dated prices, and external retailer actions. |
| PR-09 | P0 | Admin uses Supabase Auth plus explicit role authorization. Manage brands, categories, products, details, variants, ingredients, retailers, and offers. Public registration cannot grant admin access. |
| PR-10 | P0 | CSV import supports validation preview, row errors, duplicate handling, draft import, and separate publication. Data changes are transactional and attributable. |
| PR-11 | P0 | Track recommendation events and outbound clicks; labels never imply completed sales. Dashboard includes aggregate trends and data freshness. |
| PR-12 | P0 | Privacy, terms, affiliate disclosure, and contact pages use approved business details and accurately describe implemented behavior. |
| PR-13 | P0 | Protect unpublished catalogue data, consultation ownership, administration, secrets, and external destinations. Ship only after required access and link tests pass. |
| PR-14 | P0 | Separate skincare and makeup ranking; keep shade selection distinct from formula suitability. No photographic inference, diagnosis, invented claims, or unverified complexion-match guarantees. |
| PR-15 | P0 | Mobile and desktop work by keyboard/touch, with accessible errors, visible focus, readable contrast, reduced-motion support, and no horizontal page overflow at 320 CSS px. |
| PR-16 | P1 | Compare 2–4 products in a chat result or lightweight comparison view; the backend comparison tool remains in the P0 contract. |
| PR-17 | P1 | More editorial imagery, advanced dashboard filters, saved admin table views, and animation refinements after functional acceptance. |
| PR-18 | P0 | **Owner-confirmed addition:** customer accounts with private saved history. Email sign-in, save/resume, delete one/all consultations, account deletion, guest-save migration, and cross-account isolation must work. Proposed guest access remains available; no public user profiles. |

## Explicitly outside MVP

Animated avatars, voice, image upload or skin-tone inference, native apps, checkout/payment processing, reviews, wishlists, loyalty, automated scraping, approved-feed integrations, brand analytics portals, sponsored-placement purchasing, microservices, vector infrastructure, and multi-region commerce.

The schema permits declared sponsorship metadata and the interface must distinguish sponsorship if introduced; a paid-placement workflow is future scope. The shared service provides the seam for future voice/avatar/mobile clients without implementing them now.

## Product rules

1. Published facts require supplied evidence. Descriptions may describe cosmetic properties but cannot add clinical claims.
2. An eligible parent must have at least one eligible active variant. A cheap sample size must be labelled; it cannot stand in for a requested full-size or shade.
3. A strict budget means the exact variant has a fresh, SG-compatible SGD offer within the ceiling. The proposed budget is item price, including GST where verified, excluding delivery. Unknown tax treatment cannot prove the ceiling. Ask if the user means total delivered cost.
4. Proposed price freshness is 7 days and availability freshness 24 hours. These are business policies awaiting approval, not statements that stock or price remains unchanged during those windows.
5. Verified out-of-stock/discontinued offers do not support purchasable recommendations. Availability that is unknown or stale is labelled “Check availability” unless the user explicitly requires verified in-stock items, in which case exclude it.
6. Products without offers may appear in browsing as informational records; they have no shopping action. They are omitted from shopping recommendations.
7. Unknown/partial ingredients cannot prove an exclusion. “Not listed in the verified ingredient list” is distinct from “allergy-safe” or an absolute absence guarantee. No medical safety assurances.
8. A shade family or undertone is used only when verified and explicitly relevant to the request. A known reference shade is not an automatic cross-brand mapping.
9. If no candidate survives, explain the blockers and ask which constraint, if any, the user wishes to change. Never change an exclusion, budget, shade, or region silently.
10. Normal retailer links are valid before affiliate approval. Approved affiliate links require a disclosure; ranked organic results are independent of sponsorship.

## Primary journeys

- **Skincare:** choose interest → optional preferences/exclusions → review → deterministic recommendations → inspect formula/size → open exact retailer offer.
- **Makeup:** choose type → finish/formula/coverage when relevant → optional shade family/reference → budget/exclusions → compare products → select supported variant → retailer.
- **Free text:** begin chat immediately → extract only explicit intent → ask one useful clarification or search → receive verified cards → refine without losing prior explicit constraints.
- **Editor:** sign in → import CSV preview → repair invalid rows → commit drafts → review images/evidence/offers → publish eligible records → verify public output.
- **Returning customer:** email sign-in → private saved consultations → resume with current catalogue/offer revalidation → edit preferences or delete history. Saving a guest consultation requires explicit action and proven ownership of both guest session and destination account.

## Trust and privacy baseline

The owner selected customer accounts with saved history. Collect an email only for sign-in; do not request a name, phone number, photographs, precise location, marketing profile, or health history. Guests can explore without supplying an email. Ask users not to share medical or identifying details in chat. Saving is explicit, with a proposed 90-day inactivity expiry for saved consultations and controls to delete earlier. A session identifier is pseudonymous, not proof of anonymity. See the architecture for proposed retention and deletion behavior.

Catalogue admins see aggregate usage, not raw consultations. Support/contact uses an approved email link at beta rather than a new message store. Provider data handling, retention, international transfers, privacy notice, and organisational contact details must be resolved before inviting external testers. Singapore PDPC describes retention and transfer limitations; a local database alone does not settle those obligations. [PDPC obligations](https://www.pdpc.gov.sg/overview-of-pdpa/the-legislation/personal-data-protection-act/data-protection-obligations)

## Success measurement

Proposed beta measures, to be evaluated rather than fabricated as baseline performance:

| Measure | Definition / proposed gate |
|---|---|
| Grounded cards | 100% displayed IDs resolve to eligible, published database records in automated fixtures and reviewed evaluation cases |
| Critical constraint violations | Zero in required fixture suite; any observed live violation blocks expansion |
| Useful consultation | In a small owner-approved moderated test, at least 8 of 10 participants can explain a recommendation and find a retailer link without help; a directional usability gate, not statistical proof |
| No-match reasons | Count budget, ingredient-unknown, category gap, shade-unknown, no offer, and stock separately; no target that encourages unsafe relaxation |
| Funnel | Sessions started → preferences submitted or first message → recommendation served → detail opened → outbound clicked; deduplicate by session/event, exclude known bots/admin |
| Reliability | All required E2E journeys pass in staging; provider outage preserves deterministic browsing and applicable recommendations |
| Cost | Log provider/model/token totals and cap admitted requests against an owner-approved daily spend; no speculative token price estimate |

## Nonfunctional targets

- Target WCAG 2.2 AA across the required routes; automated accessibility checks supplement keyboard and screen-reader review. [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- Performance budgets, to be measured on named mobile/desktop profiles: public-page LCP ≤2.5 s, CLS ≤0.1, representative interaction latency ≤200 ms; recommendation search p95 ≤800 ms at beta load. These are design targets, not measured results.
- Chat should acknowledge immediately; target meaningful first content within 4 seconds under the selected provider, complete within a 30-second application deadline or fall back. Never expose unvalidated product text just to satisfy latency.
- Initial test load: 10 concurrent consultations and 20 concurrent catalogue browsers; adjust admission/rate limits from evidence before growing the cohort.
- Stable URLs, useful metadata, sitemap of published products, noindex admin/consultations/filter permutations, and real product structured data only when supportable.
- Fail closed for authorization and AI spending. Keep ordinary browsing available when the provider is disabled.

## Completion rule

The controlled beta is complete only when P0 functionality, curated catalogue readiness, publication checks, required automated tests, mobile/desktop review, monitoring, privacy/business approvals, and rollback rehearsal are evidenced. A successful build or attractive prototype does not establish production readiness.
