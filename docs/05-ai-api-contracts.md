# AI tools and server API contracts

**Contract version:** v1. **Authority:** server-owned catalogue and explicit user preferences. Type declarations are in [domain contracts](03-domain-contracts.ts); runtime schemas, adapters, SQL functions and handlers will be implemented only after approval.

## Provider-neutral boundary

The `LlmProvider` adapter supports two bounded jobs: validated preference extraction and evidence-constrained explanation selection. One provider/model is selected for beta after an evaluation; a deterministic fake adapter supports tests. Switching providers must pass the same contract/evaluation suite. A model supporting JSON-schema-style output is preferred, but server validation is always required.

The recommendation service has no dependency on React, streaming format, a vendor's message types, voice, or avatars. The orchestration layer owns user identity, scope, deadline, budget, tool authorization and canonical preferences. The LLM receives only the minimum relevant user text and curated evidence needed for the current turn, never authentication credentials, admin data, whole database records or hidden privileged instructions from sources.

## Intent extraction

Input: latest user message (1–2,000 characters), server-owned current preferences, and at most eight recent messages fitting a 6,000-token combined input budget. Current constraints are always included independently of historical messages so trimming context cannot remove an exclusion.

Output: `PreferencePatch` with expected revision, allowed field operations, each explicit source span, and unresolved text/questions. JSON schemas reject additional keys, wrong types, invalid categories and malformed IDs. `value: unknown` in the TypeScript declaration is replaced by a discriminated per-path runtime schema; it is not permission to accept arbitrary JSON.

Example user sentence: “Recommend a natural-looking foundation under $40 that feels lightweight.” Proposed normalized patch (excerpt):

```json
{
  "expectedRevision": 2,
  "changes": [
    {"path":"interest","operation":"set","value":"makeup","evidenceText":"foundation"},
    {"path":"makeup.categories","operation":"set","value":["foundation"],"evidenceText":"foundation"},
    {"path":"sharedBudget","operation":"set","value":{"maxSgdCents":3999,"basis":"item_price_excluding_delivery","strict":true},"evidenceText":"under $40"},
    {"path":"makeup.finishes","operation":"set","value":{"value":["natural"],"strength":"preferred","source":"explicit_chat"},"evidenceText":"natural-looking"},
    {"path":"makeup.formulas","operation":"set","value":{"value":["lightweight"],"strength":"preferred","source":"explicit_chat"},"evidenceText":"feels lightweight"}
  ],
  "uncertain": []
}
```

The server injects timestamps after validation; the patch input schema intentionally omits `updatedAt`. SG/SGD is an explicit product default presented to the user, not an inferred exchange conversion. “Up to $40” would be 4000 cents. “Something cheap” does not become a numeric budget. “Not matte” is not translated into a positive preference for every other finish without confirmation.

## Tool registry

The following names are stable external tool names; payload fields use camelCase consistently with the TypeScript contracts. Generate provider-specific JSON Schemas from the same runtime schemas, with `additionalProperties: false`. The application supplies session/actor context out of band; a model cannot choose its own actor or privileged scope.

| Tool | Input contract and limits | Output contract | Server validation |
|---|---|---|---|
| `search_products(filters)` | `SearchFilters`: canonical validated preferences, optional query ≤120 chars, brand UUIDs ≤10, limit 1–20, opaque cursor ≤512 chars | `SearchResult`: eligible parent records, eligible variant/offer tuples, supported evidence reasons, blockers, next cursor | Reapply canonical hard constraints; model search filters cannot relax or replace them. Bound query and joins; published only. |
| `get_product_details(productId)` | One UUID | `ProductDetailResult`: shared and category details, variants, applicable ingredient sets, safe offers | Published parent and active visible children; private fields stripped; 404 for absent/unpublished |
| `get_product_variants(productId, limit, cursor)` | Parent UUID, limit 1–50, optional opaque cursor | Active variants + next cursor | Parent visibility, strict parent-child relation; no arbitrary shade reference resolution |
| `compare_products(productIds)` | 2–4 distinct UUIDs | `ComparisonResult`: fact-only dimensions, records, explicit unknown cells | All published; mixed-category comparison only on shared dimensions, no invented equivalence |
| `get_retailer_offers(variantId, region)` | Variant UUID and region exactly `SG` | Active safe SG offers, verification times and disclosure state | Active variant and published parent; allowlisted HTTPS destinations; freshness computed server-side |

`get_product_details` bounds embedded variants to the first 50 plus a pagination indicator in the implementation DTO; the variant endpoint provides the remainder. Ingredient details are returned for the selected variant/default product scope, not every historical formula. Complete comparison payload is capped at 24 KB after projection; if too large, ask for fewer products or send fewer supported fields, never silently truncate a factual value.

Tool requests are read-only. A fixed allowlist rejects unknown names, extra arguments, raw SQL, arbitrary URLs, file paths and nested instructions. No browsing/fetching tool is provided to the model. Pagination cursors are signed opaque server state, not SQL fragments. Tool errors use the `ApiError` envelope; they never leak SQL/provider stacks.

## Explanation and grounding

The backend ranks candidates first and supplies at most ten parent candidates with the selected eligible variants, offer observations, and an allowlist of valid evidence/reason/caveat pairs. The LLM selects useful reason codes and follow-up question codes; the server renders catalogue facts through reviewed sentence templates. This deliberately bounds product claims while still allowing conversational intent handling and evidence-based explanations.

Before rendering, validate all of the following:

1. Every selected parent belongs to the shortlist; no duplicate parents; maximum five.
2. Every selected variant belongs to that parent and survived the hard filters.
3. Every evidence ID is current and belongs to the stated product/variant/field; the asserted reason matches the evidence value and user preference.
4. Prices, names, images, retailer names and URLs come from current database DTOs, not generated strings.
5. The response cannot reorder deterministic ranks, drop required caveats, imply a clinical benefit, guarantee a shade match, or create a numerical matching score.
6. The preference revision has not changed during generation; changed revisions abort the stale result and request a new turn.
7. Publication/offer eligibility is still valid before card emission. Any stale candidate is removed/replaced from eligible records only.

An invalid response receives at most one bounded repair attempt, then a deterministic fallback. Do not partly trust invented IDs because other IDs are valid. Record an error category and model metadata, not the complete malicious payload.

Returned `RecommendationResult` includes product/variant/offer IDs, reasons, caveats, follow-up questions, algorithm version and result state. Detail links and shopping links are generated by the backend. Archived or changed products in saved history are marked historical and cannot bypass fresh eligibility.

## Streaming and persistence

`POST /api/v1/consultations/:id/messages` returns `text/event-stream` over fetch, supporting AbortController. It is not a GET EventSource endpoint because a turn has a validated request body and mutates state. Include request and turn IDs; disable shared caching and intermediary buffering where supported.

Sequence: `status(understanding)` → `status(searching)` → `status(preparing)` → validated `text_delta` chunks → one atomic `recommendations` event → optional `follow_up` → `done`. Empty/clarification paths omit cards or return an empty result. Errors before stream start use HTTP errors; errors after headers use an `error` event and clean termination.

Provider JSON may stream into a server buffer, but product-bearing content is not exposed until it passes validation. Emit completed safe sentences/chunks as ready, without artificial typing delays. This is a streamed application response with a validation boundary, not unrestricted model-token forwarding. The UI announces completed sentences politely and does not read every token aloud.

Persist a pending user turn once, then a completed assistant message and bounded validated result snapshot atomically after validation. The private snapshot survives for the conversation's retention period independently of analytics events. On cancel/disconnect, abort provider work when possible, mark interrupted, and never treat partial output as a complete recommendation. Use `clientMessageId` for retry deduplication. One in-flight turn per session; recover authoritative final state through the session endpoint instead of replaying duplicate model calls.

## Public/server API inventory

All mutation routes use a consistent JSON schema/error envelope, request ID, origin/CSRF protection and applicable rate limit. UUID possession alone never authorizes a consultation.

| Method and route | Purpose | Access / important response behavior |
|---|---|---|
| `GET /api/v1/products` | Filter/sort/paginate catalogue | Public published data; max 24 parents, stable cursor; query parameters share filter schemas |
| `GET /api/v1/products/:slug` | Product detail projection | Public; 404 for unpublished; selected-variant offer/ingredient state |
| `POST /api/v1/consultations` | Create temporary session | Guest technical identity or signed-in customer; bounded sessions per actor |
| `GET /api/v1/consultations/:id` | Own session/messages/current preference snapshot | Owner, unexpired; message pagination; historical versus current card distinction |
| `PATCH /api/v1/consultations/:id/preferences` | Questionnaire/chat preference update | Owner; expected revision required; 409 on stale version |
| `POST /api/v1/consultations/:id/recommendations` | Questionnaire deterministic result | Owner; same service as chat; no LLM needed for questionnaire baseline |
| `POST /api/v1/consultations/:id/messages` | Stream chat turn | Owner; clientMessageId and preferenceRevision required |
| `POST /api/v1/consultations/:id/save` | Explicitly persist history | Non-anonymous owner or verified transfer grant; retention notice acknowledged |
| `DELETE /api/v1/consultations/:id` | Delete own history | Owner; idempotent; no unscoped bulk delete |
| `GET /api/v1/account/consultations` | Saved-history list | Non-anonymous customer; own paginated sessions only |
| `POST /api/v1/auth/email` and `GET /auth/callback` | Email sign-in and verified callback | Restricted redirect allowlist; email abuse protections; no user-enumeration response |
| `POST /api/v1/auth/sign-out` | Sign out | Secure cookie clearing; protected mutation |
| `POST /api/v1/consultations/:id/transfer-grant` | Prepare explicit guest save | Proven guest owner; one-use hashed token; no target chosen by a model |
| `POST /api/v1/account/import-guest` | Claim guest conversation after sign-in | Verified destination identity + grant proof; transaction locks and single-use consumption |
| `DELETE /api/v1/account` | Delete customer account/history | Fresh authentication; explicit UI confirmation; privileged accounts require separate role process |
| `GET /out/:offerId` | Validate and redirect to retailer | Only server-stored exact offer destination; safe method; count only real navigation, not prefetch/bots; 302 no-store; never arbitrary `url=` |
| `GET /api/v1/admin/analytics` | Aggregate usage and quality | Explicit admin role; no transcripts |
| `GET/POST/PATCH /api/v1/admin/{resource}` | Catalogue maintenance | Allowlisted resource schemas; editor/owner; revision checks; destructive catalogue actions archive |
| `POST /api/v1/admin/imports/validate` | Stage intake or full CSV | Admin, file type/size/schema validation; row-number report; private file store |
| `POST /api/v1/admin/imports/:id/commit` | Commit validated drafts | Admin + current batch hash; atomic; intake remains needs-enrichment |
| `POST /api/v1/admin/products/:id/publish` | Publication gate | Admin, all invariants; atomic revision; audit; cache invalidation |
| `POST /api/v1/admin/roles` | Grant/revoke editor | Owner + recent MFA; cannot escalate through profile metadata |

Account data access requests can initially be fulfilled by an owner-run, authenticated support process described in the privacy notice; an automated export UI is P1. Account deletion and consultation deletion are P0.

## Limits and failure policy (initial configurable proposals)

- User message ≤2,000 chars; 50 user turns/session; 20 open/saved sessions per account for beta; communicate limits before truncation.
- Maximum three provider calls/turn: extraction, explanation, and at most one repair total. Maximum five read tool invocations/turn, no autonomous recursion. Tool outputs count toward the 6,000-token input cap per call; reserve worst-case input/output spend before admission.
- Output caps: extraction 800 tokens; explanation 1,200; repair bounded by the operation's cap. Context includes canonical preferences even when older chat is dropped.
- One concurrent turn/session; provisional 10 turns/minute/account and 80/day/account. Guests additionally face a network-based abuse bucket and bot challenge at identity creation; do not rely solely on resettable anonymous IDs. Shared-network limits require beta tuning.
- Durable atomic counters and token reservations in PostgreSQL; no in-memory-only limiter on Vercel. Set owner-approved daily monetary cap after model selection. Reserve against a conservative token-price table, settle actual usage, fail closed on exhausted/unavailable counters.
- Application deadline 30 seconds, individual tool query deadline 3 seconds. At most one transient provider retry if total time/call/spend budgets permit. Disconnect cancels remaining work; a provider may still bill already-used tokens.
- 429 exposes retry-after; 401 asks sign-in; expired sessions offer restart; database unavailability does not return invented fallback cards; LLM outage offers validated deterministic results or structured preference inputs.

## Untrusted content and external-link controls

Product descriptions, CSV fields and retailer/source pages are data. Strip active HTML, validate lengths, delimit catalogue evidence, and never grant external text authority over tool dispatch or policies. Model-generated HTML is not rendered. Separate system instructions from catalogue/user content and adversarially test prompt injection in both.

Outbound destinations must use HTTPS, no credentials, approved exact merchant or affiliate hostnames, no IP literals/private destinations, no unexpected port, no protocol-relative or script schemes. Canonicalize URL parsing, reject control characters and malformed IDNs, and preserve only approved query patterns. Tracking hosts need explicit commercial approval; do not auto-follow/fetch arbitrary URLs in the request path. Merchant redirect behavior beyond the stored link cannot be guaranteed without a permitted review workflow.

Use `rel="sponsored noopener noreferrer"` for affiliate external links and `noopener noreferrer` for ordinary external links when opened in a new tab; same-origin `/out` navigation still makes affiliate disclosure visible before departure. Avoid Next.js prefetch on outbound actions. Only the validated offer destination is used; model output never controls it.

Broken-link checks in tests use controlled fixtures/local stubs. Human verification covers approved retailer links; any automated checker later needs permission, SSRF controls, redirect-hop checks, timeouts, rate limits and retailer terms review. An outbound click is never stored as a completed sale.
