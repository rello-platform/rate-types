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

/** Canonical 13-value RateType enum (mirrors Rello `prisma/schema.prisma` `enum RateType`). */
export const RATE_TYPES = [
  "RATE_30YR_FIXED",
  "RATE_25YR_FIXED",
  "RATE_20YR_FIXED",
  "RATE_15YR_FIXED",
  "RATE_10YR_FIXED",
  "RATE_HOMEREADY_30YR",
  "RATE_HOME_POSSIBLE_30YR",
  "RATE_5_1_ARM",
  "RATE_FHA_30YR",
  "RATE_VA_30YR",
  "RATE_USDA_30YR",
  "RATE_JUMBO_30YR",
  "RATE_SOFR",
] as const;

export type RateType = (typeof RATE_TYPES)[number];

const RATE_TYPE_SET: ReadonlySet<RateType> = new Set(RATE_TYPES);

export function isRateType(value: unknown): value is RateType {
  return typeof value === "string" && RATE_TYPE_SET.has(value as RateType);
}

/** NS-A → NS-C: PFP `rates Json` keys → Rello `RateType` enum. */
const PFP_KEY_TO_RATE_TYPE_MAP = Object.create(null) as Record<string, RateType | null>;
Object.assign(PFP_KEY_TO_RATE_TYPE_MAP, {
  conventional_30yr: "RATE_30YR_FIXED",
  conventional_25yr: "RATE_25YR_FIXED",
  conventional_20yr: "RATE_20YR_FIXED",
  conventional_15yr: "RATE_15YR_FIXED",
  conventional_10yr: "RATE_10YR_FIXED",
  homeready_30yr: "RATE_HOMEREADY_30YR",
  home_possible_30yr: "RATE_HOME_POSSIBLE_30YR",
  fha_30yr: "RATE_FHA_30YR",
  va_30yr: "RATE_VA_30YR",
  usda_30yr: "RATE_USDA_30YR",
  jumbo_30yr: "RATE_JUMBO_30YR",
});

export const PFP_KEY_TO_RATE_TYPE = Object.freeze(PFP_KEY_TO_RATE_TYPE_MAP) as Readonly<
  Record<string, RateType | null>
>;

export function pfpKeyToRateType(pfpKey: string): RateType | null {
  if (!Object.prototype.hasOwnProperty.call(PFP_KEY_TO_RATE_TYPE, pfpKey)) {
    return null;
  }
  return PFP_KEY_TO_RATE_TYPE[pfpKey] ?? null;
}

/** NS-C → NS-A: reverse for AI-prompt construction or PE-fallback emission. */
export const RATE_TYPE_TO_PFP_KEY: Readonly<Partial<Record<RateType, string>>> = Object.freeze({
  RATE_30YR_FIXED: "conventional_30yr",
  RATE_25YR_FIXED: "conventional_25yr",
  RATE_20YR_FIXED: "conventional_20yr",
  RATE_15YR_FIXED: "conventional_15yr",
  RATE_10YR_FIXED: "conventional_10yr",
  RATE_HOMEREADY_30YR: "homeready_30yr",
  RATE_HOME_POSSIBLE_30YR: "home_possible_30yr",
  RATE_FHA_30YR: "fha_30yr",
  RATE_VA_30YR: "va_30yr",
  RATE_USDA_30YR: "usda_30yr",
  RATE_JUMBO_30YR: "jumbo_30yr",
});

export function rateTypeToPfpKey(rateType: RateType): string | null {
  return RATE_TYPE_TO_PFP_KEY[rateType] ?? null;
}

/** NS-B → NS-C: PE `/api/rates/current` keys → Rello `RateType` enum. */
const PE_KEY_TO_RATE_TYPE_MAP = Object.create(null) as Record<string, RateType>;
Object.assign(PE_KEY_TO_RATE_TYPE_MAP, {
  conventional30yr: "RATE_30YR_FIXED",
  conventional25yr: "RATE_25YR_FIXED",
  conventional20yr: "RATE_20YR_FIXED",
  conventional15yr: "RATE_15YR_FIXED",
  conventional10yr: "RATE_10YR_FIXED",
  homeready30yr: "RATE_HOMEREADY_30YR",
  homePossible30yr: "RATE_HOME_POSSIBLE_30YR",
  fha30yr: "RATE_FHA_30YR",
  va30yr: "RATE_VA_30YR",
  usda30yr: "RATE_USDA_30YR",
  jumbo30yr: "RATE_JUMBO_30YR",
  sofr: "RATE_SOFR",
  mortgage30yr: "RATE_30YR_FIXED",
  mortgage15yr: "RATE_15YR_FIXED",
});

export const PE_KEY_TO_RATE_TYPE = Object.freeze(PE_KEY_TO_RATE_TYPE_MAP) as Readonly<
  Record<string, RateType>
>;

export function peKeyToRateType(peKey: string): RateType | null {
  if (!Object.prototype.hasOwnProperty.call(PE_KEY_TO_RATE_TYPE, peKey)) {
    return null;
  }
  return PE_KEY_TO_RATE_TYPE[peKey] ?? null;
}

/** FRED series ID → Rello `RateType` enum (Property Engine's `fred-rate-sync` upstream). */
const FRED_SERIES_TO_RATE_TYPE_MAP = Object.create(null) as Record<string, RateType>;
Object.assign(FRED_SERIES_TO_RATE_TYPE_MAP, {
  MORTGAGE30US: "RATE_30YR_FIXED",
  MORTGAGE15US: "RATE_15YR_FIXED",
  OBMMIC30YF: "RATE_30YR_FIXED",
  OBMMIC15YF: "RATE_15YR_FIXED",
  OBMMIFHA30YF: "RATE_FHA_30YR",
  OBMMIVA30YF: "RATE_VA_30YR",
  OBMMIJUMBO30YF: "RATE_JUMBO_30YR",
});

export const FRED_SERIES_TO_RATE_TYPE = Object.freeze(FRED_SERIES_TO_RATE_TYPE_MAP) as Readonly<
  Record<string, RateType>
>;

export function fredSeriesToRateType(seriesId: string): RateType | null {
  if (!Object.prototype.hasOwnProperty.call(FRED_SERIES_TO_RATE_TYPE, seriesId)) {
    return null;
  }
  return FRED_SERIES_TO_RATE_TYPE[seriesId] ?? null;
}

/** NS-C → human-readable label (widget chip + drawer + admin UI). */
export const RATE_TYPE_LABELS: Readonly<Record<RateType, string>> = Object.freeze({
  RATE_30YR_FIXED: "30-Year Fixed",
  RATE_25YR_FIXED: "25-Year Fixed",
  RATE_20YR_FIXED: "20-Year Fixed",
  RATE_15YR_FIXED: "15-Year Fixed",
  RATE_10YR_FIXED: "10-Year Fixed",
  RATE_HOMEREADY_30YR: "HomeReady 30-Year (Fannie)",
  RATE_HOME_POSSIBLE_30YR: "Home Possible 30-Year (Freddie)",
  RATE_5_1_ARM: "5/1 ARM",
  RATE_FHA_30YR: "FHA 30-Year",
  RATE_VA_30YR: "VA 30-Year",
  RATE_USDA_30YR: "USDA 30-Year",
  RATE_JUMBO_30YR: "Jumbo 30-Year",
  RATE_SOFR: "SOFR (ARM Index)",
});

/** Compact widget-chip labels (matches Rello `TodaysRates.tsx` RATE_PAIRS). */
export const RATE_TYPE_CHIP_LABELS: Readonly<Record<RateType, string>> = Object.freeze({
  RATE_30YR_FIXED: "30yr Fixed",
  RATE_25YR_FIXED: "25yr Fixed",
  RATE_20YR_FIXED: "20yr Fixed",
  RATE_15YR_FIXED: "15yr Fixed",
  RATE_10YR_FIXED: "10yr Fixed",
  RATE_HOMEREADY_30YR: "HomeReady",
  RATE_HOME_POSSIBLE_30YR: "Home Possible",
  RATE_5_1_ARM: "5/1 ARM",
  RATE_FHA_30YR: "FHA",
  RATE_VA_30YR: "VA",
  RATE_USDA_30YR: "USDA",
  RATE_JUMBO_30YR: "Jumbo",
  RATE_SOFR: "ARM Index",
});

// ============================================================================
// Rate-context response surface (SPEC-PLATFORM-RATE-CONTEXT-NURTURE-UNIFY §3)
// ============================================================================
//
// Phase A v0.2.0 promotes `EffectiveRate` from Rello-local + adds 5 new types
// the `/api/engine/rate-context` payload contract Phase D ships and Phase E
// consumes via type-only import (Platform Class-Level Rule E).

/** Source of an `EffectiveRate.rate` reading (rate-sheet > fred-fallback cascade). */
export type EffectiveRateSource =
  | "rate_sheet"
  | "fred_fallback"
  | "fred_fallback_missing";

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
  anchorSource:
    | "hh_lien1_rate"
    | "scout_rate_alert_current_rate"
    | "homeowner_profile_originalRate"
    | null;
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
  biggestDropLast60d: { bps: number; date: string; rateType: RateType } | null;
  biggestSpikeLast60d: { bps: number; date: string; rateType: RateType } | null;
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
