/**
 * @rello-platform/rate-types
 *
 * Canonical RateType taxonomy + cross-namespace translators for the Rello platform.
 *
 * Three rate-data namespaces coexist across the platform:
 *   - NS-A: PFP `rates Json` keys (snake_case)             — e.g., "conventional_30yr", "fha_30yr"
 *   - NS-B: PE `/api/rates/current` response (camelCase)   — e.g., "conventional30yr", "sofr"
 *   - NS-C: Rello `enum RateType` (SCREAMING_SNAKE)        — e.g., "RATE_30YR_FIXED", "RATE_SOFR"
 *
 * Plus FRED series IDs (e.g., "MORTGAGE30US", "OBMMIC30YF") and a per-RateType label map for
 * widget chip + drawer surfaces.
 *
 * Sibling: @rello-platform/permissions (single-domain canonical registry pattern).
 */
/** Canonical 35-value RateType enum (mirrors Rello `prisma/schema.prisma` `enum RateType`). */
export declare const RATE_TYPES: readonly ["RATE_30YR_FIXED", "RATE_25YR_FIXED", "RATE_20YR_FIXED", "RATE_15YR_FIXED", "RATE_10YR_FIXED", "RATE_HOMEREADY_30YR", "RATE_HOME_POSSIBLE_30YR", "RATE_5_1_ARM", "RATE_7_6_ARM", "RATE_10_6_ARM", "RATE_FHA_30YR", "RATE_FHA_15YR", "RATE_FHA_STREAMLINE", "RATE_VA_30YR", "RATE_VA_15YR", "RATE_VA_IRRRL", "RATE_USDA_30YR", "RATE_JUMBO_30YR", "RATE_JUMBO_15YR", "RATE_JUMBO_7_6_ARM", "RATE_JUMBO_10_6_ARM", "RATE_DSCR", "RATE_BANK_STATEMENT", "RATE_ITIN", "RATE_FOREIGN_NATIONAL", "RATE_1099_INCOME", "RATE_ASSET_DEPLETION", "RATE_321_BUYDOWN", "RATE_21_BUYDOWN", "RATE_CONSTRUCTION_OTC", "RATE_CONSTRUCTION_TO_PERM", "RATE_HELOC", "RATE_FIXED_SECOND", "RATE_BRIDGE", "RATE_SOFR"];
export type RateType = (typeof RATE_TYPES)[number];
export declare function isRateType(value: unknown): value is RateType;
export declare const PFP_KEY_TO_RATE_TYPE: Readonly<Record<string, RateType | null>>;
export declare function pfpKeyToRateType(pfpKey: string): RateType | null;
/** NS-C → NS-A: reverse for AI-prompt construction or PE-fallback emission. */
export declare const RATE_TYPE_TO_PFP_KEY: Readonly<Partial<Record<RateType, string>>>;
export declare function rateTypeToPfpKey(rateType: RateType): string | null;
export declare const PE_KEY_TO_RATE_TYPE: Readonly<Record<string, RateType>>;
export declare function peKeyToRateType(peKey: string): RateType | null;
export declare const FRED_SERIES_TO_RATE_TYPE: Readonly<Record<string, RateType>>;
export declare function fredSeriesToRateType(seriesId: string): RateType | null;
/** NS-C → human-readable label (widget chip + drawer + admin UI). */
export declare const RATE_TYPE_LABELS: Readonly<Record<RateType, string>>;
/** Compact widget-chip labels (matches Rello `TodaysRates.tsx` RATE_PAIRS). */
export declare const RATE_TYPE_CHIP_LABELS: Readonly<Record<RateType, string>>;
export declare const PROPERTY_TYPES: readonly ["SFR", "CONDO", "CONDO_NON_WARRANTABLE", "COOP", "PUD", "MANUFACTURED", "MODULAR", "TWO_UNIT", "THREE_UNIT", "FOUR_UNIT", "MIXED_USE"];
export type PropertyType = (typeof PROPERTY_TYPES)[number];
export declare const PROPERTY_TYPE_LABELS: Readonly<Record<PropertyType, string>>;
export declare function isPropertyType(value: unknown): value is PropertyType;
export type RateTypeCategory = "conventional" | "government" | "jumbo" | "non_qm" | "buydown" | "construction" | "second_heloc" | "index";
export declare const RATE_TYPE_CATEGORY: Readonly<Record<RateType, RateTypeCategory>>;
export declare const RATE_TYPE_CATEGORY_LABELS: Readonly<Record<RateTypeCategory, string>>;
export declare const RATE_TYPE_CATEGORY_ORDER: readonly RateTypeCategory[];
/** Source of an `EffectiveRate.rate` reading (rate-sheet > fred-fallback cascade). */
export type EffectiveRateSource = "rate_sheet" | "fred_fallback" | "fred_fallback_missing";
/** Canonical effective-rate row (promoted from `~/Rello/src/lib/rate-data/effective-rates.ts`). */
export interface EffectiveRate {
    rateType: RateType;
    /**
     * The borrower's note rate. Source-of-truth post v0.5.0:
     * - source="rate_sheet": noteRate (LPC-walked OR BPC par)
     * - source="fred_fallback": FRED market rate
     * Carries the corrected value post-cfa8da3 (PFP) + 7b53631e (Rello).
     */
    rate: number | null;
    source: EffectiveRateSource;
    effectiveDate: string;
    lenderName?: string;
    /** Wholesale rate from the lender's rate sheet (par or starting point). */
    wholesaleRate?: number;
    /** MLO's negotiated LPC YSP target with this lender (from AgentLender.markupPercent). */
    markupPct?: number;
    /** Borrower-paid points at closing (under LPC: wholesale points + LLPAs − YSP excess; under BPC: + bpcFee). */
    borrowerPointsAtClosing?: number;
    /** Comp model active at resolve time. */
    compModel?: "LPC" | "BPC";
    /** When compModel="BPC", the resolved fee mode snapshot. */
    bpcFeeMode?: "percent" | "flat" | null;
    bpcFeePercent?: number | null;
    bpcFeeFlat?: number | null;
    /** Sheet freshness state (cascade signal). */
    freshnessState?: "FRESH" | "STALE_PENDING_UPDATE";
    staleSinceAt?: string | null;
    staleWindowExpiresAt?: string | null;
    /** @deprecated v0.5.0 — use `wholesaleRate` for the corrected name. Legacy field carries the same value but the name no longer reflects the mortgage-math reality (markup is not added to rate). */
    rateWholesale?: number;
    /** @deprecated v0.5.0 — use `markupPct` for the corrected name. */
    rateMarkupPercent?: number;
    freshUntil?: string;
    assumptions?: Record<string, unknown>;
    disclosureText?: string;
    /**
     * TILA APR for this rate row, computed by PFP against the originating MLO's
     * own assumptions and persisted on the AgentRateSheet row (PFP-APR-BROADCAST
     * Phase A). Carried verbatim through the cascade — Rello never recomputes it.
     * `undefined` when PFP did not emit an APR (generic / incomplete data); the
     * render layer treats a missing APR as a suppressed-rate state (03-... §10.2:
     * "No-APR → render NO rate"), never a rate-without-APR.
     */
    apr?: number;
    /**
     * Neutral TILA assumptions footnote backing `apr` (loan amount, term, points,
     * MI, etc.). Mirror-rule (03-... §4 item 4): NO financial/profit fields
     * (markup / wholesale / comp) — profit-free by construction, exactly as
     * `MloPartnerBranding` carries "NO financial fields" (RESPA invariant).
     */
    aprAssumptions?: Record<string, unknown>;
    /**
     * Licensed-source attribution bound to a partner-sourced rate row. Present
     * ONLY when this row was resolved through the cross-tenant Partner Rate Source
     * cascade (a broker/RE-agent tenant serving a PARTNER MLO's sheets); absent on
     * own-tenant and FRED rows. The rate value and this provider tag travel
     * together as one indivisible unit (03-... §6: attribution is a control, not a
     * feature — the render contract may never omit it). Fields:
     *   - company:     the partner MLO's company name (MloPartner.company)
     *   - nmls:        the partner's NMLS license id (MloPartner.nmls) — NMLS, not MLS
     *   - mloTenantId: the partner tenant whose sheets sourced this row
     *   - brandingId:  MloPartnerBranding.id for the recipient-facing attribution payload
     */
    provider?: {
        company: string;
        nmls: string;
        mloTenantId: string;
        brandingId: string;
    };
    /**
     * Borrower-facing points ladder (par + requested offsets). Present ONLY when
     * the cascade was called with `include=ladder` AND `source === "rate_sheet"`.
     * Each entry's `price` is the ADJUSTED price (wholesale + LLPA stack), NOT raw
     * wholesale. `offset 0 === par`. Promoted from the Rello-local interface so the
     * package and local shapes converge.
     */
    ladder?: Array<{
        offset: number;
        rate: number;
        price: number;
    }>;
}
/**
 * Trend summary over a per-rateType source-filtered window — single owner for
 * both write-path (`detectRateChanges`) and read-path (`buildRateEnvironmentBlock`)
 * per SPEC §2.2. `consecutiveWeeks` is the durable signal; `dataPoints` is kept
 * for composer logic but dropped from prose per §2.11.
 */
export interface TrendSnapshot {
    direction: "declining" | "rising" | "flat";
    consecutiveWeeks: number;
    totalChangeBps: number;
    dataPoints: number;
    weeklyConsistent: boolean;
    anchorRate: number;
    currentRate: number;
}
/** `EffectiveRate` extended with per-rateType trend + offered-vs-FRED gap (SPEC §3). */
export interface EffectiveRateWithTrend extends EffectiveRate {
    trend: TrendSnapshot;
    /** Present when `source === "rate_sheet"` AND a FRED row exists for the same `rateType`. */
    offeredVsFredBps?: number;
}
/**
 * Typed lead rate-context (SPEC §3 `leadRateContext`).
 *
 * `sensitivity` is the consumer-facing string-literal-union form; Rello's
 * `RateSensitivity` Prisma enum carries the `RATE_` prefix (`RATE_HIGH` etc.)
 * and Phase D Rello-side conversion strips it at the route boundary — do not
 * mirror the prefix into this package (per dispatch §3b boundary-strip rule).
 *
 * `anchorSource` includes `scout_rate_alert_current_rate` (not SPEC §3's
 * `target_rate`) per `DISCOVERED-SPEC2-§2.7-MISSING-SCOUT-CURRENT-RATE-ANCHOR`
 * — the current-rate chain is `hh_lien1_rate > scout_rate_alert_current_rate
 * > homeowner_profile_originalRate`; target-rate is a separate opportunity
 * signal class handled in Phase D `anchors.ts`.
 */
export interface LeadRateContextPayload {
    anchorRate: number | null;
    anchorSource: "hh_lien1_rate" | "scout_rate_alert_current_rate" | "homeowner_profile_originalRate" | null;
    gapVsOfferedBps: number | null;
    gapVsFredBps: number | null;
    sensitivity: "HIGH" | "MEDIUM" | "LOW" | null;
    behavioralScore: number | null;
    alertsThisMonth: number;
    monitoringRateTypes: RateType[];
    cooldownUntil: string | null;
    recentAlerts: Array<{
        rateType: RateType;
        changeAmount: number;
        status: string;
        createdAt: string;
    }>;
}
/** 60-day rate-history summary persisted from `RateChangeEvent` (SPEC §2.10 + §3). */
export interface RecentRateHistory {
    biggestDropLast60d: {
        bps: number;
        date: string;
        rateType: RateType;
    } | null;
    biggestSpikeLast60d: {
        bps: number;
        date: string;
        rateType: RateType;
    } | null;
    milestoneCrossingsLast60d: Array<{
        milestone: number;
        direction: "down" | "up";
        date: string;
        rateType: RateType;
    }>;
    currentDirectionStreak: {
        rateType: RateType;
        direction: "declining" | "rising";
        weeks: number;
    } | null;
}
/**
 * Full `/api/engine/rate-context` response payload (SPEC §3).
 *
 * Phase D ships this contract; Phase E1 cuts Milo Engine over to type-only
 * import per Class-Level Rule E. Text blocks (`rateEnvironment`,
 * `leadRateProfile`) are pre-rendered for direct prompt injection; typed
 * fields drive composer branching + urgency scaling.
 */
export interface RateContextResponse {
    rateEnvironment: string;
    leadRateProfile: string | null;
    effectiveRates: EffectiveRateWithTrend[];
    leadRateContext: LeadRateContextPayload | null;
    recentRateHistory: RecentRateHistory;
    dataStatus: "FRESH" | "STALE";
    generatedAt: string;
    resolvedFromMloId: string | null;
}
//# sourceMappingURL=index.d.ts.map