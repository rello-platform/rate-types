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
/** Canonical 11-value RateType enum (mirrors Rello `prisma/schema.prisma` `enum RateType`). */
export declare const RATE_TYPES: readonly ["RATE_30YR_FIXED", "RATE_25YR_FIXED", "RATE_20YR_FIXED", "RATE_15YR_FIXED", "RATE_10YR_FIXED", "RATE_5_1_ARM", "RATE_FHA_30YR", "RATE_VA_30YR", "RATE_USDA_30YR", "RATE_JUMBO_30YR", "RATE_SOFR"];
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
/** Source of an `EffectiveRate.rate` reading (rate-sheet > fred-fallback cascade). */
export type EffectiveRateSource = "rate_sheet" | "fred_fallback" | "fred_fallback_missing";
/** Canonical effective-rate row (promoted from `~/Rello/src/lib/rate-data/effective-rates.ts`). */
export interface EffectiveRate {
    rateType: RateType;
    rate: number | null;
    source: EffectiveRateSource;
    effectiveDate: string;
    lenderName?: string;
    rateWholesale?: number;
    rateMarkupPercent?: number;
    freshUntil?: string;
    assumptions?: Record<string, unknown>;
    disclosureText?: string;
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