export type BrandPerceptionReport = { [key: string]: any };

export const attributeKeys = [
    "voice", "tone", "coherence", "purpose", "values", "narrative",
    "promise", "personas", "vision", "themes", "mission", "archetype",
    "portfolio", "positioning", "tagline", "rhetoric", "lexicon", "architecture"
] as const;

export type AttributeKey = typeof attributeKeys[number];

export const filterKeys = ["all", "foundation", "identity", "narrative", "strategy"] as const;

export type FilterType = typeof filterKeys[number];

export type ViewType = "platforms" | "implications";