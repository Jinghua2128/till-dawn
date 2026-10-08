# Design system and complete page specification

## Reference review and visual status

Only the text brief is available. No Pinterest screenshots were attached, so no image-reference review has been claimed. This proposal interprets the supplied palette and written direction: dusty pink, chocolate, cream, silk, frosted surfaces, reflective details, editorial type and restrained motion. Obtain the screenshots before locking final visual fidelity; do not copy their artwork into production.

Original concept images accompany this document as review aids. They are not approved production designs or catalogue assets. Product imagery must depict the actual verified product and carry commercial-use permission. Generated abstract scenery can support the brand; generated fictitious cosmetics must never masquerade as the curated catalogue.

- [Landing overview concept](concepts/landing-overview-v1.png): all landing sections and saved-history invitation, 1086×1448px.
- [Consultation concept](concepts/consultation-v2.png): desktop preferences/chat workspace with sign-in, save, history and deletion controls, 1536×1024px.
- [Generation prompts and provenance](concepts/README.md): built-in ImageGen generation and revision record.

Both images were visually inspected. Their purpose is direction approval; mobile screens, verified recommendation cards, authenticated/history screens, admin states and readable section details need their own reference approval before those surfaces are coded. The written specifications below cover their complete structure and behavior.

## Creative direction

**Beauty, considered.** A quiet editorial front door leads into a practical consultation workspace. Use pink architectural/silk scenery on marketing surfaces, cream reading surfaces and chocolate controls. A single frosted panel can anchor chat; catalogue and admin surfaces use clear, mostly opaque backgrounds. Reflective accents remain decorative and never compete with labels, filters, or recommendations.

The landing page varies full-width scenery, an open category diptych, a typographic explanation band and a simple saved-history invitation. Product cards are used where products must be compared, not as a wrapper around every paragraph. No avatar, voice button, cart, fabricated review or conversion metric.

## Tokens

| Token | Value | Use |
|---|---|---|
| `color.canvas` | `#F8F0EC` | Primary cream page and reading surface |
| `color.ink` | `#281F20` | Body, headings, labels |
| `color.brand` | `#70483F` | Primary buttons, links, strong border/focus |
| `color.pink` | `#E4AFB9` | Decorative planes, selected fills with ink text |
| `color.rose` | `#C58D9C` | Decorative accents; not small text on cream |
| `color.surface` | `#FFFDFC` | Opaque form/table surface where needed |
| `color.glass` | Cream at 90% opacity, blur 16px | Decorative/chat frame only; opaque fallback |
| `color.divider` | Ink at 16% opacity | Nonessential separators; not sole control boundary |
| `color.focus` | `#70483F`, 2px ring, 3px offset | Visible keyboard focus; contrasting outer gap |
| `space` | 4, 8, 12, 16, 24, 32, 48, 64, 96px | Shared rhythm; no one-off gaps without reason |
| `radius` | 6px controls, 12px panels, 50% swatches | Restrained soft geometry; no universal pill cards |
| `shadow.panel` | 0 16px 48px ink / 8% | One level of elevation; no stacked shadows |
| `width.content` | max 1280px; reading max 720px | Shared site gutters and legal text |
| `motion` | 140ms feedback, 220ms panel, 400ms editorial reveal | Opacity/transform only where possible |

Calculated sRGB contrast for solid palette pairs: ink/cream **14.28:1**, brown/cream **6.95:1**, ink/pink **8.52:1**, rose/cream **2.44:1**, pink/cream **1.68:1**, brown/pink **4.14:1**. Use ink for normal text on pink; rose/pink cannot serve as normal body text on cream. Glass requires measuring the final composite background rather than assuming these ratios apply.

Target normal-text contrast at least 4.5:1, large text 3:1, meaningful UI boundaries 3:1. Design 44×44px touch targets even where WCAG's minimum target-size criterion allows smaller ones; focus, errors and selection never rely on color alone. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

## Typography and layout

Proposed font pair: Cormorant Garamond for editorial headings and Manrope for body/UI, with Georgia and system sans fallbacks. Verify the distributed font files' commercial-use licenses at asset ingestion and self-host only licensed subsets. Product names, forms, numbers, prices and admin tables use the sans face for legibility.

| Role | Desktop | Mobile | Treatment |
|---|---|---|---|
| Hero H1 | 64–80px / 1.02 | 40–48px / 1.06 | Serif, regular; short lines |
| Page H1 | 40–48px / 1.12 | 32–36px / 1.15 | Serif; real semantic H1 |
| Section H2 | 32–40px / 1.15 | 28px / 1.2 | Serif |
| Product heading | 20–24px / 1.3 | 18–20px / 1.3 | Sans medium |
| Body | 16–18px / 1.6 | 16px / 1.6 | Sans regular |
| Labels/buttons | 14–16px / 1.4 | 16px / 1.4 | Sans medium |
| Metadata | 13–14px / 1.5 | 14px / 1.5 | Never essential information at tiny size |

Breakpoints are layout decisions at 640, 768, 1024 and 1280 CSS px. Gutters: 20px mobile (16px at 320px), 32px tablet, 64px desktop. Twelve-column desktop grid, six tablet, four mobile; avoid rigid fixed heights on text-bearing sections. Marketing spacing 64–96px desktop / 40–56px mobile; application spacing 16–32px.

Reduce all nonessential motion for `prefers-reduced-motion`. Floating scenery uses an optional subtle 6px drift, pauses when offscreen, never moves input controls. No cursor-follow effects or scroll hijacking. Motion cannot hide content from keyboard/screen-reader access.

## Shared components and states

| Component | Anatomy and behavior |
|---|---|
| `SiteHeader` | Wordmark, Skincare, Makeup, Consultation, Sign in or History/account menu; active link underline; mobile menu with focus return |
| `Button` / `TextLink` | Primary brown/cream, secondary clear/brown border, inline underline; default/hover/focus/pressed/loading/disabled; preserve button width while busy |
| `Field` | Visible label, optional indicator, hint, input, linked validation message; retain user value after error |
| `ChoiceGroup` | Semantic radio/checkbox grouping, visible selected check, keyboard support, no auto-advance on selection |
| `QuestionnaireShell` | Step count, short title, optional fields, Back/Skip/Continue, persistent direct-chat path |
| `ProductCard` | Image, brand, name, variant context, dated price or unknown label, 1–3 verified reasons, caveats, Details and retailer action |
| `ShadeSelector` | Text + optional verified swatch; roving keyboard selection; selected label and outline; no color-only names, no invented swatch for missing hex |
| `OfferRow` | Retailer, exact variant, dated price, availability state, disclosure, external-link action; no implied lowest total delivered price |
| `ChatComposer` | Multiline labelled input, send/stop, character feedback near limit; Enter sends, Shift+Enter new line; respects IME composition |
| `Message` / `Results` | User/assistant identity; readable paragraphs; validated product cards; historical-result label on resume; retry and interrupted state |
| `PreferencesSummary` | Human-readable active filters and edit action; exclusions always visible without translating into medical claims |
| `HistoryList` | Neutral title, last active date, expiry, resume/delete actions; owner-only content; pagination |
| `DataTable` | Semantic headings, row actions, pagination, status text, filter/search; keyboard-operable overflow region on small screens |
| `ImportReview` | File/batch status, counts by validity, row-number errors, draft preview, commit summary; no automatic publication |
| `StatusPanel` | Loading, no results, missing data, expired, offline, forbidden and provider fallback; specific recovery action |

Use shadcn/ui primitives for dialogs, sheets, selects, popovers and tables where they improve accessibility. Style them to these tokens rather than inheriting a generic storefront. One product-card and one detail component family handle both kinds via typed property groups.

## Routes and page anatomy

### `/` — landing

1. Quiet header with customer Sign in/History.
2. Asymmetric hero: “Beauty, considered.”; “Explore skincare and makeup through a conversation about what matters to you.” Primary “Start a consultation”, secondary “Browse the catalogue”. Original pink arch/silk/glass artwork in a separable media frame; no body text baked into assets.
3. Two editorial category entries: Skincare — “Textures, ingredients and everyday rituals.”; Makeup — “Finish, formula and colour, on your terms.” Deep links preselect category.
4. “A little conversation. A considered shortlist.” Three simple steps: share preferences, explore verified details, choose retailer. Explain external purchases and catalogue grounding.
5. Saved-history invitation: “Pick up where you left off.” / “Sign in to save your consultation history.” This is an invitation, not a gate to browsing.
6. Footer with privacy, terms, affiliate disclosure, contact and truthful affiliate explanation.

Desktop hero about 55/45 text/media; mobile stacks copy/CTA before a shorter art frame. No hero eyebrow or badge, fake statistics, endorsements or filler merchandise. Catalogue-dependent editorial picks can be added only after real data approval and are outside this initial page composition.

### `/consultation` — entry and optional questionnaire

Header, introductory question “What would you like to explore?”, interest choices, direct chat action, session/privacy notice and optional account-save explanation. Questionnaire branch table is authoritative. No account is needed to begin a temporary consultation under the proposed access model.

Create session lazily when the user starts interacting. Empty state is intentional; do not fabricate previous chat. Show suggested prompts such as “A lightweight foundation up to S$40” and “Help me compare moisturizer textures”. These prompts are requests, not product claims.

### `/consultation/[id]` — conversation

Desktop: 240–280px preferences sidebar, 640–800px chat reading area, recommendations inline below the relevant assistant message. No third competing panel. Header includes saved/unsaved state, Save conversation, History, and clear/start-again actions. Composer remains visible without obscuring the last message.

Mobile: one column; preference summary collapses into an accessible sheet; cards stack rather than forcing horizontal swipes; keyboard opening and safe-area insets must keep composer/send visible. Scroll follows output only while the user is already near the bottom; otherwise show “New response”.

States: initial prompts, optional questionnaire, understanding/searching, streaming text, verified recommendations, clarification, zero results, partial result by category, error/retry, offline draft, rate limit, expired session, interrupted generation, save pending/success/failure, historical resumed results. Editing preferences visibly invalidates previous results until refreshed.

“Clear chat” explains whether it deletes the current conversation; “Start a new consultation” creates a separate session without deleting saved history. Use explicit labels and confirmation for deletion. Product price and variant labels remain visible in the card; a general formula suggestion says “Choose a shade” unless a supported variant preference exists.

### `/products` — catalogue

H1 “Explore the catalogue”, skincare/makeup navigation, search, filter summary/count, sorting and product results. Desktop uses a 220px filter column and 3-column product grid; tablet two columns; mobile two columns where card text fits, otherwise one. Catalogue cards are appropriate comparison surfaces; avoid nested decorative cards around the filter UI.

Shared filters: category, brand, SGD maximum price, optional verified stock. Skincare: type, skin type, cosmetic goal, texture, fragrance. Makeup: type, finish, applicable coverage, formula, supported shade family/undertone. Avoid an ingredient search UI suggesting medical safety; use the same strict exclusion pipeline and clear unknown-data explanation when exposing it.

Sorts: relevance when search/preferences exist, name A–Z, verified price low–high/high–low, newest published. Unknown/stale prices go last for price sorting, and do not satisfy a price filter. Brand sorting is optional. “From” price must use an eligible active variant and reveal size/shade context. Query-string filter state is shareable; consultation text/health/exclusion free text is never put in public URLs.

Show exact result count, applied filters and Clear filters. Debounce search, cancel stale requests and preserve focus/scroll predictably. No-result message identifies active restrictions. Offline/error state offers retry; skeleton geometry reserves image and text space.

### `/products/[slug]` — product details

Breadcrumb, approved image gallery, brand/name, description, typed property section, active size/shade options, current selected-variant ingredient information, retailer offers, evidence/last-checked context, disclosures, and “Discuss this product” deep link that sends only the product ID into a private chat.

Desktop image/content split; mobile images then identity/variant/price/actions, with a compact sticky action only if it does not cover content. No internal checkout/cart. Variant changes update image, ingredient set, offer and price together. An unavailable variant stays visibly unavailable rather than falling back silently.

Makeup renders shade names even without swatches and labels shade guidance as unconfirmed. Skincare uses the same variant selector foundation for sizes. Ingredient section distinguishes complete, partial and unavailable lists. Offer rows label last verification and explain final retailer pricing/delivery. If all offers are missing, display “No retailer offer available” and omit shopping CTA.

### `/sign-in`, `/auth/callback` — customer access

Email field, “Send sign-in link”, clear pending/success/error/expired-link states, notice on saved-history handling and a way back to guest browsing. Do not reveal whether an email already has an account. Validated return path is same-origin/allowlisted. Customer UI never shows admin access unless the server confirms the role.

### `/account/history`, `/account` — saved history and account

History lists neutral conversation titles, category summary, last updated date, expiry, Resume and Delete. Empty state begins a consultation. Search is optional; pagination is required. Account shows signed-in email, sign-out, retention explanation, delete-history and delete-account actions. Delete-account requires reauthentication and explicit confirmation, reports success, and does not silently fail after UI disappearance.

### `/admin/login`, `/admin` — administration

Login checks identity and role; denied users receive no admin metadata. Dashboard shows published/draft product counts, overdue prices/stock, incomplete ingredients, outstanding intake items, validated recommendation/no-match counts, outbound clicks and provider errors/spend. Label all counts accurately; no revenue/sales conversion unless a later verified source provides it.

| Route | Main content / controls |
|---|---|
| `/admin/intake` | Names-and-links queue, unresolved identity/metadata checklist, assignee/status, link to verification editor |
| `/admin/products` | Search/filter/status table, Create product, Edit, Archive; no instant publish toggle bypassing validation |
| `/admin/products/new` and `/admin/products/[id]` | Shared identity/description, category details, variants, ingredients, evidence, images/rights, offer summary, draft preview and publication report |
| `/admin/brands` | Name, slug, website, active state; blocked deletion if referenced |
| `/admin/categories` | Category tree, kind and applicability; prevent invalid reparent/reclassification |
| `/admin/retailers` | Retailer identity, normal/affiliate hostname allowlists and approval records |
| `/admin/offers` | Variant, SG/SGD price, tax, stock, source/check times, normal/approved affiliate URL and disclosure |
| `/admin/imports` and `/admin/imports/[id]` | Intake or catalogue import, schema guidance, staging report, deduplication choices, draft commit and errors |
| `/admin/analytics` | Date-range aggregates and data-quality indicators; no transcript browser |
| `/admin/access` | Owner-only editor-role management; recent MFA and audit trail |

Product editor tabs reuse field/component definitions rather than creating one editor per makeup subtype. Admin mobile mode prioritizes viewing and simple edits; tables have labelled horizontal scrolling. CSV review remains usable on mobile, though desktop is recommended for long batch corrections.

### `/privacy`, `/terms`, `/affiliate-disclosure`, `/contact`

Readable legal template with actual entity name, contact, effective date and implemented policy. Privacy covers email, guest identities, saved chats, vendors/transfers, retention/deletion, analytics and support. Terms explain cosmetic discovery limits, retailer transactions and source/price changes. Affiliate page explains commissions and independent organic ranking. Contact exposes the approved support email without building a new inbox service.

Copy is drafted only after business details and policy decisions are supplied; do not publish fictitious contact/entity information or claim legal compliance from a template alone.

## Responsive and accessibility acceptance

Review at 320, 390, 768, 1024 and 1440 CSS px; portrait/landscape phone, 200% zoom, keyboard navigation, reduced motion and a screen reader. Check menu/sheet/dialog focus trapping and return, input labels, correct heading order, input error associations, shade text, live status announcements, tables, empty/error states and external-link context. No hover-only functionality.

Before implementation of each visual surface, approve a readable screen/section reference, component inventory, exact visible copy, asset list and mobile behavior. The initial full-page overview alone is insufficient to prove implementation fidelity for detailed states. Browser-rendered comparisons occur at milestone implementation time; no browser or accessibility pass is claimed for these planning artifacts.
