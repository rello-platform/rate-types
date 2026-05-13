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

/** Canonical 8-value RateType enum (mirrors Rello `prisma/schema.prisma` `enum RateType`). */
export const RATE_TYPES = [
  "RATE_30YR_FIXED",
  "RATE_15YR_FIXED",
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
  conventional_20yr: null,
  conventional_15yr: "RATE_15YR_FIXED",
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
  RATE_15YR_FIXED: "conventional_15yr",
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
  conventional15yr: "RATE_15YR_FIXED",
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
  RATE_15YR_FIXED: "15-Year Fixed",
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
  RATE_15YR_FIXED: "15yr Fixed",
  RATE_5_1_ARM: "5/1 ARM",
  RATE_FHA_30YR: "FHA",
  RATE_VA_30YR: "VA",
  RATE_USDA_30YR: "USDA",
  RATE_JUMBO_30YR: "Jumbo",
  RATE_SOFR: "ARM Index",
});
