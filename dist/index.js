"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RATE_TYPE_CATEGORY_ORDER = exports.RATE_TYPE_CATEGORY_LABELS = exports.RATE_TYPE_CATEGORY = exports.PROPERTY_TYPE_LABELS = exports.PROPERTY_TYPES = exports.RATE_TYPE_CHIP_LABELS = exports.RATE_TYPE_LABELS = exports.FRED_SERIES_TO_RATE_TYPE = exports.PE_KEY_TO_RATE_TYPE = exports.RATE_TYPE_TO_PFP_KEY = exports.PFP_KEY_TO_RATE_TYPE = exports.RATE_TYPES = void 0;
exports.isRateType = isRateType;
exports.pfpKeyToRateType = pfpKeyToRateType;
exports.rateTypeToPfpKey = rateTypeToPfpKey;
exports.peKeyToRateType = peKeyToRateType;
exports.fredSeriesToRateType = fredSeriesToRateType;
exports.isPropertyType = isPropertyType;
/** Canonical 35-value RateType enum (mirrors Rello `prisma/schema.prisma` `enum RateType`). */
exports.RATE_TYPES = [
    // Conventional Fixed
    "RATE_30YR_FIXED",
    "RATE_25YR_FIXED",
    "RATE_20YR_FIXED",
    "RATE_15YR_FIXED",
    "RATE_10YR_FIXED",
    "RATE_HOMEREADY_30YR",
    "RATE_HOME_POSSIBLE_30YR",
    // Conventional ARM
    "RATE_5_1_ARM",
    "RATE_7_6_ARM",
    "RATE_10_6_ARM",
    // Government
    "RATE_FHA_30YR",
    "RATE_FHA_15YR",
    "RATE_FHA_STREAMLINE",
    "RATE_VA_30YR",
    "RATE_VA_15YR",
    "RATE_VA_IRRRL",
    "RATE_USDA_30YR",
    // Jumbo
    "RATE_JUMBO_30YR",
    "RATE_JUMBO_15YR",
    "RATE_JUMBO_7_6_ARM",
    "RATE_JUMBO_10_6_ARM",
    // Non-QM
    "RATE_DSCR",
    "RATE_BANK_STATEMENT",
    "RATE_ITIN",
    "RATE_FOREIGN_NATIONAL",
    "RATE_1099_INCOME",
    "RATE_ASSET_DEPLETION",
    // Buydown
    "RATE_321_BUYDOWN",
    "RATE_21_BUYDOWN",
    // Construction
    "RATE_CONSTRUCTION_OTC",
    "RATE_CONSTRUCTION_TO_PERM",
    // Second / HELOC
    "RATE_HELOC",
    "RATE_FIXED_SECOND",
    "RATE_BRIDGE",
    // Index
    "RATE_SOFR",
];
const RATE_TYPE_SET = new Set(exports.RATE_TYPES);
function isRateType(value) {
    return typeof value === "string" && RATE_TYPE_SET.has(value);
}
/** NS-A → NS-C: PFP `rates Json` keys → Rello `RateType` enum. */
const PFP_KEY_TO_RATE_TYPE_MAP = Object.create(null);
Object.assign(PFP_KEY_TO_RATE_TYPE_MAP, {
    conventional_30yr: "RATE_30YR_FIXED",
    conventional_25yr: "RATE_25YR_FIXED",
    conventional_20yr: "RATE_20YR_FIXED",
    conventional_15yr: "RATE_15YR_FIXED",
    conventional_10yr: "RATE_10YR_FIXED",
    homeready_30yr: "RATE_HOMEREADY_30YR",
    home_possible_30yr: "RATE_HOME_POSSIBLE_30YR",
    fha_30yr: "RATE_FHA_30YR",
    fha_15yr: "RATE_FHA_15YR",
    fha_streamline: "RATE_FHA_STREAMLINE",
    va_30yr: "RATE_VA_30YR",
    va_15yr: "RATE_VA_15YR",
    va_irrrl: "RATE_VA_IRRRL",
    usda_30yr: "RATE_USDA_30YR",
    jumbo_30yr: "RATE_JUMBO_30YR",
    jumbo_15yr: "RATE_JUMBO_15YR",
    jumbo_7_6_arm: "RATE_JUMBO_7_6_ARM",
    jumbo_10_6_arm: "RATE_JUMBO_10_6_ARM",
    conventional_7_6_arm: "RATE_7_6_ARM",
    conventional_10_6_arm: "RATE_10_6_ARM",
    dscr: "RATE_DSCR",
    bank_statement: "RATE_BANK_STATEMENT",
    itin: "RATE_ITIN",
    foreign_national: "RATE_FOREIGN_NATIONAL",
    income_1099: "RATE_1099_INCOME",
    asset_depletion: "RATE_ASSET_DEPLETION",
    buydown_321: "RATE_321_BUYDOWN",
    buydown_21: "RATE_21_BUYDOWN",
    construction_otc: "RATE_CONSTRUCTION_OTC",
    construction_to_perm: "RATE_CONSTRUCTION_TO_PERM",
    heloc: "RATE_HELOC",
    fixed_second: "RATE_FIXED_SECOND",
    bridge: "RATE_BRIDGE",
});
exports.PFP_KEY_TO_RATE_TYPE = Object.freeze(PFP_KEY_TO_RATE_TYPE_MAP);
function pfpKeyToRateType(pfpKey) {
    if (!Object.prototype.hasOwnProperty.call(exports.PFP_KEY_TO_RATE_TYPE, pfpKey)) {
        return null;
    }
    return exports.PFP_KEY_TO_RATE_TYPE[pfpKey] ?? null;
}
/** NS-C → NS-A: reverse for AI-prompt construction or PE-fallback emission. */
exports.RATE_TYPE_TO_PFP_KEY = Object.freeze({
    RATE_30YR_FIXED: "conventional_30yr",
    RATE_25YR_FIXED: "conventional_25yr",
    RATE_20YR_FIXED: "conventional_20yr",
    RATE_15YR_FIXED: "conventional_15yr",
    RATE_10YR_FIXED: "conventional_10yr",
    RATE_HOMEREADY_30YR: "homeready_30yr",
    RATE_HOME_POSSIBLE_30YR: "home_possible_30yr",
    RATE_7_6_ARM: "conventional_7_6_arm",
    RATE_10_6_ARM: "conventional_10_6_arm",
    RATE_FHA_30YR: "fha_30yr",
    RATE_FHA_15YR: "fha_15yr",
    RATE_FHA_STREAMLINE: "fha_streamline",
    RATE_VA_30YR: "va_30yr",
    RATE_VA_15YR: "va_15yr",
    RATE_VA_IRRRL: "va_irrrl",
    RATE_USDA_30YR: "usda_30yr",
    RATE_JUMBO_30YR: "jumbo_30yr",
    RATE_JUMBO_15YR: "jumbo_15yr",
    RATE_JUMBO_7_6_ARM: "jumbo_7_6_arm",
    RATE_JUMBO_10_6_ARM: "jumbo_10_6_arm",
    RATE_DSCR: "dscr",
    RATE_BANK_STATEMENT: "bank_statement",
    RATE_ITIN: "itin",
    RATE_FOREIGN_NATIONAL: "foreign_national",
    RATE_1099_INCOME: "income_1099",
    RATE_ASSET_DEPLETION: "asset_depletion",
    RATE_321_BUYDOWN: "buydown_321",
    RATE_21_BUYDOWN: "buydown_21",
    RATE_CONSTRUCTION_OTC: "construction_otc",
    RATE_CONSTRUCTION_TO_PERM: "construction_to_perm",
    RATE_HELOC: "heloc",
    RATE_FIXED_SECOND: "fixed_second",
    RATE_BRIDGE: "bridge",
});
function rateTypeToPfpKey(rateType) {
    return exports.RATE_TYPE_TO_PFP_KEY[rateType] ?? null;
}
/** NS-B → NS-C: PE `/api/rates/current` keys → Rello `RateType` enum. */
const PE_KEY_TO_RATE_TYPE_MAP = Object.create(null);
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
exports.PE_KEY_TO_RATE_TYPE = Object.freeze(PE_KEY_TO_RATE_TYPE_MAP);
function peKeyToRateType(peKey) {
    if (!Object.prototype.hasOwnProperty.call(exports.PE_KEY_TO_RATE_TYPE, peKey)) {
        return null;
    }
    return exports.PE_KEY_TO_RATE_TYPE[peKey] ?? null;
}
/** FRED series ID → Rello `RateType` enum (Property Engine's `fred-rate-sync` upstream). */
const FRED_SERIES_TO_RATE_TYPE_MAP = Object.create(null);
Object.assign(FRED_SERIES_TO_RATE_TYPE_MAP, {
    MORTGAGE30US: "RATE_30YR_FIXED",
    MORTGAGE15US: "RATE_15YR_FIXED",
    OBMMIC30YF: "RATE_30YR_FIXED",
    OBMMIC15YF: "RATE_15YR_FIXED",
    OBMMIFHA30YF: "RATE_FHA_30YR",
    OBMMIVA30YF: "RATE_VA_30YR",
    OBMMIJUMBO30YF: "RATE_JUMBO_30YR",
});
exports.FRED_SERIES_TO_RATE_TYPE = Object.freeze(FRED_SERIES_TO_RATE_TYPE_MAP);
function fredSeriesToRateType(seriesId) {
    if (!Object.prototype.hasOwnProperty.call(exports.FRED_SERIES_TO_RATE_TYPE, seriesId)) {
        return null;
    }
    return exports.FRED_SERIES_TO_RATE_TYPE[seriesId] ?? null;
}
/** NS-C → human-readable label (widget chip + drawer + admin UI). */
exports.RATE_TYPE_LABELS = Object.freeze({
    RATE_30YR_FIXED: "30-Year Fixed",
    RATE_25YR_FIXED: "25-Year Fixed",
    RATE_20YR_FIXED: "20-Year Fixed",
    RATE_15YR_FIXED: "15-Year Fixed",
    RATE_10YR_FIXED: "10-Year Fixed",
    RATE_HOMEREADY_30YR: "HomeReady 30-Year (Fannie)",
    RATE_HOME_POSSIBLE_30YR: "Home Possible 30-Year (Freddie)",
    RATE_5_1_ARM: "5/1 ARM",
    RATE_7_6_ARM: "7/6 ARM",
    RATE_10_6_ARM: "10/6 ARM",
    RATE_FHA_30YR: "FHA 30-Year",
    RATE_FHA_15YR: "FHA 15-Year",
    RATE_FHA_STREAMLINE: "FHA Streamline Refinance",
    RATE_VA_30YR: "VA 30-Year",
    RATE_VA_15YR: "VA 15-Year",
    RATE_VA_IRRRL: "VA IRRRL Refinance",
    RATE_USDA_30YR: "USDA 30-Year",
    RATE_JUMBO_30YR: "Jumbo 30-Year",
    RATE_JUMBO_15YR: "Jumbo 15-Year",
    RATE_JUMBO_7_6_ARM: "Jumbo 7/6 ARM",
    RATE_JUMBO_10_6_ARM: "Jumbo 10/6 ARM",
    RATE_DSCR: "DSCR (Investor Cash Flow)",
    RATE_BANK_STATEMENT: "Bank Statement",
    RATE_ITIN: "ITIN",
    RATE_FOREIGN_NATIONAL: "Foreign National",
    RATE_1099_INCOME: "1099 Income",
    RATE_ASSET_DEPLETION: "Asset Depletion",
    RATE_321_BUYDOWN: "3-2-1 Temporary Buydown",
    RATE_21_BUYDOWN: "2-1 Temporary Buydown",
    RATE_CONSTRUCTION_OTC: "One-Time Close Construction",
    RATE_CONSTRUCTION_TO_PERM: "Construction-to-Permanent",
    RATE_HELOC: "HELOC (variable)",
    RATE_FIXED_SECOND: "Fixed-Rate Second Mortgage",
    RATE_BRIDGE: "Bridge Loan",
    RATE_SOFR: "SOFR (ARM Index)",
});
/** Compact widget-chip labels (matches Rello `TodaysRates.tsx` RATE_PAIRS). */
exports.RATE_TYPE_CHIP_LABELS = Object.freeze({
    RATE_30YR_FIXED: "30yr Fixed",
    RATE_25YR_FIXED: "25yr Fixed",
    RATE_20YR_FIXED: "20yr Fixed",
    RATE_15YR_FIXED: "15yr Fixed",
    RATE_10YR_FIXED: "10yr Fixed",
    RATE_HOMEREADY_30YR: "HomeReady",
    RATE_HOME_POSSIBLE_30YR: "Home Possible",
    RATE_5_1_ARM: "5/1 ARM",
    RATE_7_6_ARM: "7/6 ARM",
    RATE_10_6_ARM: "10/6 ARM",
    RATE_FHA_30YR: "FHA",
    RATE_FHA_15YR: "FHA 15yr",
    RATE_FHA_STREAMLINE: "FHA Streamline",
    RATE_VA_30YR: "VA",
    RATE_VA_15YR: "VA 15yr",
    RATE_VA_IRRRL: "VA IRRRL",
    RATE_USDA_30YR: "USDA",
    RATE_JUMBO_30YR: "Jumbo",
    RATE_JUMBO_15YR: "Jumbo 15yr",
    RATE_JUMBO_7_6_ARM: "Jumbo 7/6",
    RATE_JUMBO_10_6_ARM: "Jumbo 10/6",
    RATE_DSCR: "DSCR",
    RATE_BANK_STATEMENT: "Bank Stmt",
    RATE_ITIN: "ITIN",
    RATE_FOREIGN_NATIONAL: "Foreign Nat'l",
    RATE_1099_INCOME: "1099",
    RATE_ASSET_DEPLETION: "Asset Depl",
    RATE_321_BUYDOWN: "3-2-1 Buydown",
    RATE_21_BUYDOWN: "2-1 Buydown",
    RATE_CONSTRUCTION_OTC: "Construction OTC",
    RATE_CONSTRUCTION_TO_PERM: "Construction-Perm",
    RATE_HELOC: "HELOC",
    RATE_FIXED_SECOND: "Fixed 2nd",
    RATE_BRIDGE: "Bridge",
    RATE_SOFR: "ARM Index",
});
// ============================================================================
// Property types (v0.6.0 — shared enum for assumption + disclosure surfaces)
// ============================================================================
exports.PROPERTY_TYPES = [
    "SFR",
    "CONDO",
    "CONDO_NON_WARRANTABLE",
    "COOP",
    "PUD",
    "MANUFACTURED",
    "MODULAR",
    "TWO_UNIT",
    "THREE_UNIT",
    "FOUR_UNIT",
    "MIXED_USE",
];
exports.PROPERTY_TYPE_LABELS = Object.freeze({
    SFR: "Single Family Residence",
    CONDO: "Condo (warrantable)",
    CONDO_NON_WARRANTABLE: "Condo (non-warrantable)",
    COOP: "Co-op",
    PUD: "PUD / Townhome",
    MANUFACTURED: "Manufactured (perm foundation)",
    MODULAR: "Modular / Factory-built",
    TWO_UNIT: "Duplex",
    THREE_UNIT: "Triplex",
    FOUR_UNIT: "Fourplex",
    MIXED_USE: "Mixed Use (residential + commercial)",
});
const PROPERTY_TYPE_SET = new Set(exports.PROPERTY_TYPES);
function isPropertyType(value) {
    return typeof value === "string" && PROPERTY_TYPE_SET.has(value);
}
exports.RATE_TYPE_CATEGORY = Object.freeze({
    RATE_30YR_FIXED: "conventional",
    RATE_25YR_FIXED: "conventional",
    RATE_20YR_FIXED: "conventional",
    RATE_15YR_FIXED: "conventional",
    RATE_10YR_FIXED: "conventional",
    RATE_HOMEREADY_30YR: "conventional",
    RATE_HOME_POSSIBLE_30YR: "conventional",
    RATE_5_1_ARM: "conventional",
    RATE_7_6_ARM: "conventional",
    RATE_10_6_ARM: "conventional",
    RATE_FHA_30YR: "government",
    RATE_FHA_15YR: "government",
    RATE_FHA_STREAMLINE: "government",
    RATE_VA_30YR: "government",
    RATE_VA_15YR: "government",
    RATE_VA_IRRRL: "government",
    RATE_USDA_30YR: "government",
    RATE_JUMBO_30YR: "jumbo",
    RATE_JUMBO_15YR: "jumbo",
    RATE_JUMBO_7_6_ARM: "jumbo",
    RATE_JUMBO_10_6_ARM: "jumbo",
    RATE_DSCR: "non_qm",
    RATE_BANK_STATEMENT: "non_qm",
    RATE_ITIN: "non_qm",
    RATE_FOREIGN_NATIONAL: "non_qm",
    RATE_1099_INCOME: "non_qm",
    RATE_ASSET_DEPLETION: "non_qm",
    RATE_321_BUYDOWN: "buydown",
    RATE_21_BUYDOWN: "buydown",
    RATE_CONSTRUCTION_OTC: "construction",
    RATE_CONSTRUCTION_TO_PERM: "construction",
    RATE_HELOC: "second_heloc",
    RATE_FIXED_SECOND: "second_heloc",
    RATE_BRIDGE: "second_heloc",
    RATE_SOFR: "index",
});
exports.RATE_TYPE_CATEGORY_LABELS = Object.freeze({
    conventional: "Conventional",
    government: "Government",
    jumbo: "Jumbo",
    non_qm: "Non-QM",
    buydown: "Buydowns",
    construction: "Construction",
    second_heloc: "Second/HELOC",
    index: "Index",
});
exports.RATE_TYPE_CATEGORY_ORDER = [
    "conventional",
    "government",
    "jumbo",
    "non_qm",
    "buydown",
    "construction",
    "second_heloc",
    "index",
];
//# sourceMappingURL=index.js.map