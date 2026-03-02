export interface BrandAttribute {
    text: string | string[];
    implication: string;
}

export interface BrandData {
    mission: BrandAttribute;
    vision: BrandAttribute;
    purpose: BrandAttribute;
    values: BrandAttribute;
    positioning: BrandAttribute;
    themes: BrandAttribute;
    promise: BrandAttribute;
    tagline: BrandAttribute;
    voice: BrandAttribute;
    tone: BrandAttribute;
    lexicon: BrandAttribute;
    rhetoric: BrandAttribute;
    narrative: BrandAttribute;
    archetype: BrandAttribute;
    coherence: BrandAttribute;
    personas: BrandAttribute;
    portfolio: BrandAttribute;
    architecture: BrandAttribute;
}

export type BrandName = 'MAGNA' | 'APTIV' | 'BOSCH MOBILITY' | 'CONTINENTAL' | 'DENSO' | 'FORVIA' | 'GENTEX' | 'LEAR' | 'VALEO' | 'ZF';

export type FilterType = 'all' | 'narrative' | 'verbal' | 'archetype' | 'strategic';

export type ViewType = 'platforms' | 'implications';

export type AttributeKey = keyof BrandData;