# @rello-platform/rate-types

Canonical `RateType` enum + cross-namespace translators for the Rello platform. A single source of truth for the 8-value mortgage rate taxonomy used by Rello, PathfinderPro (PFP), Property Engine (PE), and every future cross-spoke consumer. Consuming this package makes a `RateType` rename a **compile error** in every consumer instead of a silent NaN.

## Install

```bash
npm install "github:rello-platform/rate-types#v0.1.0"
```

For Railway nixpacks: the repo is **public** and `dist/` is committed, so unauthenticated SHA-pinned `npm install` works without an ssh client.

## The four namespaces

| NS  | Surface                                  | Shape                  | Example                |
|-----|------------------------------------------|------------------------|------------------------|
| A   | PFP `rates Json` keys (AI extraction)    | snake_case             | `conventional_30yr`    |
| B   | PE `/api/rates/current` response         | camelCase              | `conventional30yr`     |
| C   | Rello `enum RateType`                    | SCREAMING_SNAKE        | `RATE_30YR_FIXED`      |
| D   | FRED series IDs (PE upstream)            | upper/no-separator     | `MORTGAGE30US`         |

NS-C is canonical. The other three translate into NS-C via the helpers in this package.

## Usage

```ts
import {
  RATE_TYPES,
  RATE_TYPE_LABELS,
  RATE_TYPE_CHIP_LABELS,
  isRateType,
  pfpKeyToRateType,
  rateTypeToPfpKey,
  peKeyToRateType,
  fredSeriesToRateType,
  type RateType,
} from "@rello-platform/rate-types";

// PFP AI-extraction → Rello enum
const rt = pfpKeyToRateType("fha_30yr"); // → "RATE_FHA_30YR"

// PE response → Rello enum (handles legacy `mortgage30yr` / `mortgage15yr` aliases)
const peRt = peKeyToRateType("mortgage30yr"); // → "RATE_30YR_FIXED"

// FRED series → Rello enum
const fredRt = fredSeriesToRateType("OBMMIFHA30YF"); // → "RATE_FHA_30YR"

// Type-guard for runtime validation at boundaries
if (!isRateType(input)) {
  throw new Error(`Unknown RateType: ${input}`);
}

// Widget UI chip labels
for (const rt of RATE_TYPES) {
  console.log(RATE_TYPE_CHIP_LABELS[rt]); // "30yr Fixed", "15yr Fixed", ...
}
```

### Note on `conventional_20yr`

PFP's AI extraction prompt captures `conventional_20yr` but Rello's `enum RateType` has no corresponding value. `pfpKeyToRateType("conventional_20yr")` returns `null` — extraction-side capture-but-orphan per RECON-06 §C.4. Adding a `RATE_20YR_FIXED` value is deferred until product calls for a 20-year surface on the chip-row or drawer.

## Shape

```ts
const RATE_TYPES: readonly [
  "RATE_30YR_FIXED",
  "RATE_15YR_FIXED",
  "RATE_5_1_ARM",
  "RATE_FHA_30YR",
  "RATE_VA_30YR",
  "RATE_USDA_30YR",
  "RATE_JUMBO_30YR",
  "RATE_SOFR",
];

type RateType = (typeof RATE_TYPES)[number];
```

## Adding a new RateType value

Bump `version` here AND ship the atomic Rello `enum RateType` migration AND update every consumer's pin in lockstep. Discipline:

1. Add the value to `RATE_TYPES` in `src/index.ts` (preserve array order; new values append).
2. Add label entries in `RATE_TYPE_LABELS` and `RATE_TYPE_CHIP_LABELS`.
3. If a PFP / PE / FRED translation exists, add it to the corresponding map. If not, document the gap in the README's namespace table.
4. Bump `version` to a new SemVer minor (additive) or major (breaking — only if removing an existing value).
5. `npm run build`, commit, tag, push, release.
6. In the Rello PR that adds the value to `prisma/schema.prisma enum RateType`, bump the consumer pin to the new release SHA atomically.
7. Bump consumer pins in PFP + any other consumers as separate PRs.

## Sibling packages

- [`@rello-platform/permissions`](https://github.com/rello-platform/permissions) — canonical permission registry (the pattern this package mirrors)
- [`@rello-platform/slugs`](https://github.com/rello-platform/slugs) — canonical app/engine slugs
- [`@rello-platform/api-client`](https://github.com/rello-platform/api-client) — cross-app HTTP client + base-URL helpers

## Provenance

Authored 2026-05-13 as PR-1 of the MLO Rate Sheet Ingestion workstream per B-08 lock from `~/RELLO TO BE BUILT/BUILD-|-WORKSTREAM/MLO RATE SHEET INGESTION/ANSWERS.md`. Pre-launch ship at v0.1.0.

Pre-flight verbatim grep anchored at:
- Rello SHA `abc097bae00225b02d8a302248475b7837864fc5` — `prisma/schema.prisma enum RateType` (8 values)
- PFP SHA `563a4d502ac6b268976dbb5c0e0dc1658aa5a0e4` — `src/app/api/rate-sheets/route.ts RATE_EXTRACTION_PROMPT` (7 keys)
