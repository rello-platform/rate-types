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
export declare const RATE_TYPES: readonly ["RATE_30YR_FIXED", "RATE_15YR_FIXED", "RATE_5_1_ARM", "RATE_FHA_30YR", "RATE_VA_30YR", "RATE_USDA_30YR", "RATE_JUMBO_30YR", "RATE_SOFR"];
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
//# sourceMappingURL=index.d.ts.map