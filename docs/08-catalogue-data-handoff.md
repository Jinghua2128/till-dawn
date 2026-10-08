# Teammate catalogue handoff and CSV specification

**Confirmed starting point:** product names and retailer links only. Those are intake leads. They are not sufficient to publish verified recommendations, certify ingredients, show current prices, or identify an exact shade/size offer.

## Work ownership

The teammate verifies facts and rights from permitted brand/retailer/packaging sources and records evidence. The engineer supplies the intake editor/import validator, controlled vocabulary, schema mapping and publication checks. Business-side approval is responsible for image permissions, affiliate approval, final claims, support details and review cadence. No automatic scraping is assumed or authorized.

Work in this order: 8–12 diverse pilot parents → agree the template/taxonomy → enrich the remaining catalogue → final offer refresh near launch. Prefer one verified complete parent with real variants over many name-only records. Missing information remains unknown, never an invented value.

## Minimum intake now

The teammate can begin with these exact columns; only the first two are required:

```text
product_name,retailer_url,brand_name,notes
```

The system assigns a stable intake key. It validates the URL without fetching it, stores the row privately, and marks it `needs_enrichment`. A name-only lead does not create a public product or fake “default shade”. A retailer link that changes products with a query parameter needs manual verification of its exact variant scope.

## Required data before publication

| Area | Exact information | Required to publish? | Required for matching? |
|---|---|---|---|
| Identity | Brand, official parent product name, category/subcategory, description limited to supported cosmetic facts, source URL, source access date | Yes | Yes |
| Stable keys | Unique brand/product/variant/retailer/offer keys maintained across edits; engineer can assign once | Yes | Yes; avoid duplicate parents |
| Variant identity | Official size/shade label; actual SKU if known; size and unit where stated; pack count; active state; formulation/region distinctions | At least one real active variant | Exact eligible purchasable unit |
| Skincare attributes | Supported skin types, texture, formula and cosmetic goals; fragrance declaration; evidence per populated field | Unknown allowed for optional fields | Required when a hard request uses that field; otherwise no match credit |
| Makeup attributes | Finish, coverage where relevant, formula, properties; evidence per populated field | Unknown allowed | Same; coverage may be inapplicable |
| Shade metadata | Official shade name; verified family/undertone/hex only if supplied; source for each | Shade name when the variant is a shade | Family/undertone constraints need evidence; no fabricated swatch or cross-brand match |
| Ingredients | Raw INCI text, ordered normalized names, completeness, may-contain markers, specific formula/variant/region coverage, source and date | Unknown allowed with disclosure | Complete/current applicable list required for exclusion-constrained recommendations |
| Image | Actual product/variant image file or approved source, alt text, rights basis/reference, expiration if any | One approved product image | Useful data completeness; never use Pinterest/product imagery without rights |
| Offer | Exact variant, retailer, SG compatibility, normal URL, SGD price if known, tax treatment, separate price and stock verification times/source | Product can be browse-only without offers | Safe active offer required for shopping recommendations; fresh tax-inclusive price for a strict budget |
| Commercial relationship | Approved affiliate URL, reference/date/expiry and host, sponsorship status/label | Only when applicable | Does not affect organic score |
| Verification | Who checked each source/claim, when, source locator, next review/valid-until | Yes for asserted facts | Current evidence only |

Brand/retailer names are not permission to use their logos or images. A public page URL establishes provenance, not a commercial image licence. “Verified” means a reviewer checked a source, not that Till Dawn clinically validated the claim.

## Controlled vocabulary and unknowns

Use the allowed values in [domain contracts](03-domain-contracts.ts). New useful values require a reviewed taxonomy change rather than a spelling variant. A complete raw list is not sufficient for exclusions until every ingredient token has been normalized and reviewed (`normalization_status=complete`). Use canonical INCI names, preserving the manufacturer's raw text separately. Use `null`/empty optional cells for unknown, not `false`, `0`, “none”, “safe”, or an invented shade.

Skincare subtype codes: `cleanser`, `moisturizer`, `serum`, `sunscreen`, `toner`. Makeup codes: `foundation`, `concealer`, `blush`, `lip`, `mascara`, `eye`. Categories have display labels and can grow under the existing two kinds; future subtype additions do not require new product tables or frontend applications.

Same formula, different sizes: one parent, separate variants; share ingredients only with evidence covering both. Same foundation, different shades: one parent, multiple variants, possibly separate ingredient sets. A genuine different formulation/edition can be a new parent if product identity warrants it; do not merge by similar names alone.

## Import format v1

Accept UTF-8 RFC-4180-style CSV with a header row, properly quoted fields, preserved INCI punctuation, ISO-8601 timestamps with timezone, explicit `true`/`false`, and JSON arrays for multi-value cells. Initial limits: **2 MB total per staged batch, 2,000 rows total**, 10,000 characters per description/INCI cell, 2,048 characters per URL. Validate limits before parsing deeply. These are beta limits, not storage model limits.

For a complete catalogue batch, upload the following logical CSVs separately into one staged batch; no ZIP extraction required. Existing approved lookups can be referenced without uploading their files. The teammate can gather data in a simpler worksheet; the import tool/export helper produces these normalized files. Do not require the teammate to supply database UUIDs.

| File / sheet | Exact columns |
|---|---|
| `brands.csv` | `brand_key,name,slug,website_url,active` |
| `categories.csv` | `category_code,name,kind,parent_code,active,sort_order` |
| `products.csv` | `product_key,brand_key,category_code,name,slug,description,skin_types,textures,cosmetic_goals,finishes,coverages,formulas,properties,fragrance_status` |
| `variants.csv` | `variant_key,product_key,sku,label,shade_name,shade_family,swatch_hex,undertone,size_value,size_unit,pack_count,formulation_code,active,sort_order` |
| `sources.csv` | `source_key,url,publisher,source_kind,accessed_at,locator` |
| `evidence.csv` | `evidence_key,product_key,variant_key,field_path,verified_value,source_key,verified_at,valid_until` |
| `ingredient_sets.csv` | `ingredient_set_key,product_key,variant_key,scope_label,completeness,normalization_status,raw_inci,source_key,verified_at,valid_until` |
| `product_ingredients.csv` | `ingredient_set_key,inci_name,position,presence` |
| `retailers.csv` | `retailer_key,name,slug,allowed_hosts,approved_affiliate_hosts,active` |
| `offers.csv` | `offer_key,variant_key,retailer_key,region,currency,price_sgd,tax_included,product_url,affiliate_url,affiliate_approval_ref,affiliate_approved_at,affiliate_expires_at,availability,price_verified_at,availability_verified_at,source_key,active,is_sponsored,sponsor_label` |
| `assets.csv` | `asset_key,product_key,variant_key,storage_path,alt_text,sort_order,source_key,rights_basis,rights_reference,rights_expires_at` |

Sources are `pending` until the importing/admin reviewer verifies them; `verified_by` is derived from that authenticated reviewer, not trusted CSV text. Evidence similarly requires review. Every imported product starts as **draft**; imported `status=published`, admin roles or auth fields are rejected. Assets start unapproved. Changing a price, ingredient list, image or factual field invalidates the applicable prior verification unless the same reviewed transaction supplies new evidence.

Catalogues need at least one evidence row for identity/description, plus each asserted property; category applicability is enforced. Allowed `field_path` examples: `identity`, `description`, `skincare.skin_types`, `skincare.textures`, `skincare.cosmetic_goals`, `makeup.finishes`, `makeup.coverages`, `details.formulas`, `details.fragrance_status`, `variant.shade_name`, `variant.shade_family`, `variant.undertone`, `variant.swatch_hex`, `variant.size`. These paths form a strict versioned allowlist; the stored verified value must equal the field's value at publication.

For money, input `price_sgd` is a decimal string with up to two fractional digits, e.g. `39.90`; parse losslessly into `3990` cents. Reject negative values, currency symbols mixed into numbers, ambiguous thousands separators, scientific notation and more than two decimal places. Blank price means unknown, never free. In a strict-budget recommendation, unknown tax inclusion cannot establish the ceiling.

Dates cannot be implausibly in the future; a `valid_until` must follow verification. Availability may be unknown even when the price was checked. Do not stamp all stock values “in_stock” on import. Expired affiliate approval leaves the ordinary URL usable if otherwise safe.

## Import behavior

1. **Stage:** admin chooses intake or catalogue mode; upload into private storage; compute content hash and schema version. No live catalogue writes.
2. **Validate:** headers/types/size/duplicates, valid codes, parent-child links, uniqueness, exact hosts, attribute applicability, source/evidence linkage and image paths. Report file, row, column, code and repair message; neutralize spreadsheet-formula prefixes in downloadable reports while retaining original data safely.
3. **Review:** group normalized rows by parent. Show creates/updates/conflicts, incomplete evidence, omitted offers/ingredients and values being replaced. Flag missing references; do not guess brand, shade, variant or price from names/URLs.
4. **Commit:** one transaction upserts approved drafts by stable keys. Same batch hash is idempotent. Stale revision/conflicting duplicate content aborts the batch; no silent last-row-wins and no partial product aggregate.
5. **Verify:** editor completes outstanding facts, image rights and offer checks. For intake mode, conversion into catalogue drafts occurs only after required normalized identities exist.
6. **Publish:** a separate deliberate action runs the publication gate. Invalid products remain draft with reasons. The public page and recommendation fixture are reviewed for the pilot batch.

Default update policy: explicit nonempty values replace draft fields; blank optional cells mean “unknown” only for a new record. Existing-record clears require the review UI's explicit clear choice, preventing accidental erasure from incomplete CSVs. No delete-through-import in beta. Imported changes to published products are staged for review rather than editing public facts mid-import; implementation may use an import proposal snapshot until the publish transaction applies it.

Images are uploaded to controlled storage or obtained under an approved asset workflow. The import process never fetches arbitrary supplied URLs, executes formulas, renders active HTML, or scrapes retailer pages. Storage paths must reference an approved private upload owned by the current admin workflow; only approved assets become publicly accessible.

## Publication checklist for the teammate

- Parent identity is distinct and source-backed; correct category and brand.
- Each listed size/shade is real, correctly named and related to that parent.
- Optional facts are either verified with scope/date or visibly unknown.
- Ingredient list is complete/partial/unknown accurately, with may-contain and variant overrides retained.
- Image depicts the right product, has accurate alt text and documented commercial-use rights.
- Each retailer URL points to the stated variant or clearly requires selection; links that cannot target/confirm a variant are not used as exact-variant offers.
- Price, tax, availability and verification times are recorded separately; no inferred sale/stock claim.
- Affiliate/sponsorship fields are approved and disclosed; otherwise use ordinary links.
- Preview displays the correct product, variant, evidence labels and retailer action on mobile and desktop.

## Ongoing catalogue operations

Use an admin due-review list sorted by price/stock expiry and missing facts. Refresh price observations within the approved policy window; recheck availability at the cadence actually sustainable for the team. When availability cannot be kept current, label it unknown instead of inventing certainty. Disable expired/broken offers; do not remove the parent's legitimate educational information automatically.

Before beta, review category coverage and the percentage of variants with usable INCI and SGD offers. A catalogue count alone is insufficient: 80 name-only entries cannot satisfy an ingredient-aware recommendation journey. Reserve time for product reformulations, new shade names, discontinued sizes and image permission expiry.
