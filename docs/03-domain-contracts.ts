/**
 * Till Dawn v1 design contracts — declarations only, not application code.
 * All external values require runtime schemas and database validation.
 * string aliases do not establish UUID, URL, timestamp, or evidence validity.
 */
export type UUID = string;
export type ISODateTime = string;
export type HttpsUrl = string;
export type Currency = "SGD";
export type Region = "SG";
export type Money = { currency: Currency; minorUnits: number };
export type Kind = "skincare" | "makeup";
export type Interest = Kind | "both" | "exploring";
export type ProductStatus = "draft" | "published" | "archived";
export type SkincareCategory = "cleanser" | "moisturizer" | "serum" | "sunscreen" | "toner";
export type MakeupCategory = "foundation" | "concealer" | "blush" | "lip" | "mascara" | "eye";
export type CategoryCode = SkincareCategory | MakeupCategory;
export type SkinType = "dry" | "oily" | "combination" | "balanced" | "sensitive";
export type Texture = "gel" | "cream" | "lotion" | "oil" | "foam" | "balm" | "watery";
export type CosmeticGoal = "hydration" | "softness" | "radiance" | "oil_control" | "even_looking_tone";
export type Finish = "natural" | "dewy" | "matte" | "satin" | "luminous" | "glossy";
export type Coverage = "sheer" | "light" | "medium" | "full" | "buildable";
export type Formula = "liquid" | "cream" | "powder" | "stick" | "gel" | "lightweight";
export type ShadeFamily = "pink" | "rose" | "peach" | "coral" | "red" | "berry" | "brown" | "beige" | "black" | "clear";
export type Undertone = "warm" | "cool" | "neutral" | "olive";
export type FragranceStatus = "declared_free" | "present" | "unknown";
export type Availability = "in_stock" | "out_of_stock" | "discontinued" | "unknown";

export interface EvidenceRef {
  id: UUID;
  sourceId: UUID;
  fieldPath: string;
  verifiedAt: ISODateTime;
  validUntil: ISODateTime;
}
export type Supported<T> =
  | { status: "verified"; value: T; evidence: EvidenceRef[] }
  | { status: "unknown" | "stale"; value: null; evidence: EvidenceRef[] };

export interface ProductAsset {
  id: UUID;
  url: HttpsUrl;
  altText: string;
  variantId: UUID | null;
}
export interface ProductBase {
  id: UUID;
  brandId: UUID;
  brandName: string;
  categoryId: UUID;
  name: string;
  slug: string;
  description: string;
  status: ProductStatus;
  revision: number;
  assets: ProductAsset[];
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
export interface SkincareDetails {
  skinTypes: Supported<SkinType[]>;
  textures: Supported<Texture[]>;
  formulas: Supported<Formula[]>;
  cosmeticGoals: Supported<CosmeticGoal[]>;
  fragranceStatus: Supported<Exclude<FragranceStatus, "unknown">>;
}
export interface MakeupDetails {
  finishes: Supported<Finish[]>;
  coverages: Supported<Coverage[]>;
  formulas: Supported<Formula[]>;
  properties: Supported<string[]>; // Runtime allowlist, e.g. documented water resistance.
  fragranceStatus: Supported<Exclude<FragranceStatus, "unknown">>;
}
export type SkincareProduct = ProductBase & {
  kind: "skincare";
  category: SkincareCategory;
  details: SkincareDetails;
};
export type MakeupProduct = ProductBase & {
  kind: "makeup";
  category: MakeupCategory;
  details: MakeupDetails;
};
export type Product = SkincareProduct | MakeupProduct;

export interface ProductVariant {
  id: UUID;
  productId: UUID;
  sku: string | null;
  label: string;
  size: { value: number; unit: "ml" | "g" | "oz" | "fl_oz" | "count" } | null;
  packCount: number;
  shadeName: Supported<string>;
  shadeFamily: Supported<ShadeFamily>;
  swatchHex: Supported<string>; // Display aid, never a complexion-match measurement.
  undertone: Supported<Undertone>;
  formulationCode: string | null;
  image: ProductAsset | null;
  active: boolean;
}
export interface IngredientEntry {
  ingredientId: UUID;
  inciName: string;
  position: number;
  presence: "definite" | "may_contain";
}
export interface IngredientSet {
  id: UUID;
  productId: UUID;
  variantId: UUID | null;
  completeness: "complete" | "partial" | "unknown";
  normalizationStatus: "complete" | "needs_review";
  freshness: "current" | "stale" | "unverified";
  scopeLabel: string;
  rawInci: string | null;
  entries: IngredientEntry[];
  sourceId: UUID | null;
  verifiedAt: ISODateTime | null;
  validUntil: ISODateTime | null;
}
export interface RetailerOffer {
  id: UUID;
  variantId: UUID;
  retailerId: UUID;
  retailerName: string;
  region: Region;
  price: Money | null;
  taxIncluded: boolean | null;
  priceVerifiedAt: ISODateTime | null;
  availability: Availability;
  availabilityVerifiedAt: ISODateTime | null;
  active: boolean;
  productUrl: HttpsUrl;
  affiliate: { url: HttpsUrl; approvedAt: ISODateTime; expiresAt: ISODateTime | null } | null;
  sponsorship: { disclosed: true; label: string } | null;
}

export type PreferenceSource = "questionnaire" | "explicit_chat" | "confirmed_chat";
export interface Preference<T> {
  value: T;
  strength: "preferred" | "required";
  source: PreferenceSource;
  updatedAt: ISODateTime;
}
export type Budget = {
  maxSgdCents: number;
  basis: "item_price_excluding_delivery";
  strict: boolean;
};
export type ShadeReference =
  | { status: "catalogue_resolved"; productId: UUID; variantId: UUID; userText: string }
  | { status: "unresolved"; userText: string };
export interface SkincarePreferences {
  categories: SkincareCategory[];
  skinTypes: Preference<SkinType[]> | null;
  cosmeticGoals: Preference<CosmeticGoal[]> | null;
  textures: Preference<Texture[]> | null;
  formulas: Preference<Formula[]> | null;
}
export interface MakeupPreferences {
  categories: MakeupCategory[];
  finishes: Preference<Finish[]> | null;
  coverages: Preference<Coverage[]> | null;
  formulas: Preference<Formula[]> | null;
  shadeFamilies: Preference<ShadeFamily[]> | null;
  undertones: Preference<Undertone[]> | null;
  referenceShade: ShadeReference | null;
  requestedVariantId: UUID | null;
}
export interface ConsultationPreferences {
  schemaVersion: 1;
  interest: Interest;
  region: Region;
  sharedBudget: Budget | null;
  budgetsByKind: Partial<Record<Kind, Budget>>;
  excludedIngredientIds: UUID[];
  unresolvedExclusions: string[];
  fragranceFreeRequired: boolean;
  verifiedInStockRequired: boolean;
  requestedSize: { value: number; unit: "ml" | "g" | "oz" | "fl_oz" | "count" } | null;
  skincare: SkincarePreferences | null;
  makeup: MakeupPreferences | null;
  skippedQuestionIds: string[];
}
export interface PreferencePatch {
  expectedRevision: number;
  // Runtime schemas whitelist paths and enforce their matching value schemas.
  changes: Array<{
    path: string;
    operation: "set" | "clear";
    value: unknown;
    evidenceText: string;
  }>;
  uncertain: Array<{ text: string; question: string }>;
}

export type MatchReasonCode =
  | "category" | "skin_type" | "cosmetic_goal" | "texture" | "formula"
  | "finish" | "coverage" | "shade_family" | "undertone" | "within_budget";
export type CaveatCode =
  | "shade_unconfirmed" | "reference_unresolved" | "ingredients_incomplete"
  | "availability_unknown" | "price_stale" | "price_unknown" | "tax_unknown"
  | "delivery_excluded" | "limited_catalogue";
export type NoMatchCode =
  | "category_gap" | "over_budget" | "ingredient_present" | "ingredients_unknown"
  | "unresolved_exclusion" | "no_offer" | "stock_unavailable"
  | "price_unverified" | "shade_metadata_missing" | "required_attribute_missing";
export interface MatchReason {
  code: MatchReasonCode;
  evidenceIds: UUID[];
  offerId: UUID | null;
  text: string; // Server-approved template or evidence-constrained rendering.
}
export type PriceDisplay =
  | { state: "verified_observation"; amount: Money; verifiedAt: ISODateTime; offerId: UUID }
  | { state: "stale"; lastObserved: Money; verifiedAt: ISODateTime; label: "Check retailer for price" }
  | { state: "unknown"; label: "Check retailer for price" | "No retailer offer available" };
export interface RecommendationCard {
  productId: UUID;
  productName: string;
  brandName: string;
  kind: Kind;
  image: ProductAsset | null;
  selectedVariantId: UUID;
  variantLabel: string;
  eligibleVariantIds: UUID[];
  offerId: UUID;
  price: PriceDisplay;
  availabilityLabel: string;
  reasons: MatchReason[];
  caveats: CaveatCode[];
  productHref: string;
  shoppingHref: string; // Same-origin /out/:offerId, never a model-generated URL.
  sponsorship: { label: string } | null;
}
export interface RecommendationResult {
  requestId: UUID;
  algorithmVersion: string;
  preferenceRevision: number;
  outcome: "matched" | "partial" | "no_match" | "clarification_required";
  cards: RecommendationCard[];
  blockers: Array<{ code: NoMatchCode; count: number }>;
  followUpQuestions: string[];
  explanationMode: "assisted" | "deterministic_fallback";
}
export interface ExplanationProposal {
  recommendations: Array<{
    productId: UUID;
    variantId: UUID;
    reasonSelections: Array<{ code: MatchReasonCode; evidenceIds: UUID[] }>;
    caveatCodes: CaveatCode[];
  }>;
  followUpQuestionCodes: string[];
  // No executable tool, URL, price, score, arbitrary medical claim, or ranking authority.
}

export interface SearchFilters {
  preferences: ConsultationPreferences;
  query?: string;
  brandIds?: UUID[];
  limit: number; // Tool 1..20, catalogue 1..24.
  cursor?: string;
}
export interface SearchResult {
  candidates: Array<{
    product: Product;
    eligibleVariants: ProductVariant[];
    eligibleOffers: RetailerOffer[];
    supportedReasons: MatchReason[];
  }>;
  blockers: Array<{ code: NoMatchCode; count: number }>;
  nextCursor: string | null;
}
export interface ProductDetailResult {
  product: Product;
  selectedVariantId: UUID | null;
  variantsNextCursor: string | null;
  variants: ProductVariant[];
  ingredientSets: IngredientSet[];
  offers: RetailerOffer[];
}
export interface ComparisonResult {
  products: ProductDetailResult[];
  dimensions: Array<{ code: string; label: string }>;
  unknownFields: Array<{ productId: UUID; field: string }>;
}
export interface ToolContracts {
  search_products: { input: SearchFilters; output: SearchResult };
  get_product_details: { input: { productId: UUID }; output: ProductDetailResult };
  get_product_variants: {
    input: { productId: UUID; limit: number; cursor?: string };
    output: { variants: ProductVariant[]; nextCursor: string | null };
  };
  compare_products: { input: { productIds: UUID[] }; output: ComparisonResult };
  get_retailer_offers: { input: { variantId: UUID; region: Region }; output: { offers: RetailerOffer[] } };
}
export type ToolName = keyof ToolContracts;
export type ToolCall<K extends ToolName> = { name: K; arguments: ToolContracts[K]["input"] };
export type ToolResponse<K extends ToolName> =
  | { ok: true; result: ToolContracts[K]["output"] }
  | { ok: false; error: ApiError };
export interface RequestContext {
  userId: UUID;
  sessionId: UUID;
  requestId: UUID;
  deadlineAt: ISODateTime;
  canonicalPreferences: ConsultationPreferences;
}
export interface RecommendationService {
  recommend(preferences: ConsultationPreferences, context: RequestContext): Promise<RecommendationResult>;
}
export interface LlmProvider {
  extractIntent(input: { text: string; current: ConsultationPreferences; recentTurns: string[] },
    context: RequestContext): Promise<PreferencePatch>;
  explain(input: { candidates: SearchResult; maxCards: number },
    context: RequestContext): Promise<ExplanationProposal>;
}
export interface ConsultationSession {
  id: UUID;
  mode: "temporary" | "saved";
  title: string | null;
  expiresAt: ISODateTime;
  savedAt: ISODateTime | null;
  preferenceRevision: number;
}
export interface ChatMessage {
  id: UUID;
  turnId: UUID;
  sequence: number;
  role: "user" | "assistant";
  content: string;
  recommendationSnapshot: RecommendationResult | null;
  state: "pending" | "complete" | "interrupted" | "failed";
}
export type ApiErrorCode =
  | "INVALID_INPUT" | "UNAUTHENTICATED" | "FORBIDDEN" | "NOT_FOUND"
  | "SESSION_EXPIRED" | "REVISION_CONFLICT" | "RATE_LIMITED"
  | "BUDGET_EXHAUSTED" | "PROVIDER_UNAVAILABLE" | "UNSAFE_LINK"
  | "VALIDATION_FAILED" | "INTERNAL_ERROR";
export interface ApiError { code: ApiErrorCode; message: string; requestId: UUID; retryable: boolean }
export type ChatStreamEvent =
  | { type: "status"; stage: "understanding" | "searching" | "preparing"; turnId: UUID }
  | { type: "text_delta"; text: string; turnId: UUID }
  | { type: "recommendations"; result: RecommendationResult; turnId: UUID }
  | { type: "follow_up"; questions: string[]; turnId: UUID }
  | { type: "done"; messageId: UUID; turnId: UUID }
  | { type: "error"; error: ApiError; turnId: UUID };
