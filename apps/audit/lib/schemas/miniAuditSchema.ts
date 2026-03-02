import { z } from "zod";

export const EvidenceSchema = z.object({
  text: z.string().describe("Verbatim text or concise summary"),
  url: z.string().describe("Source URL for the evidence"),
});

export const ScoredItemSchema = z.object({
  score: z.number().min(0).max(10).nullable().describe("Score from 1-10"),
  evidence: z.array(EvidenceSchema).optional(),
  notes: z.string().optional(),
});

export const AuditScopeSchema = z.object({
  scopeMethod: z.string().describe("Description of scope and method (outside-in, amnesia protocol, etc)"),
});

export const ExecutiveSummarySchema = z.object({
  categoryFraming: z.string(),
  coreStrength: z.string(),
  coreRisk: z.string(),
  humanMachineMisalignment: z.string(),
  highestLeverageAction: z.string(),
});

export const OutsideInEntryTestSchema = z.object({
  clarity10s: z.string().nullable(),
  whoItsFor: z.string().nullable(),
  primaryCtas: z.array(z.string()),
  trustSignalsEarly: z.array(z.string()),
  confusions: z.array(z.string()),
  confidence: z.enum(["High", "Medium", "Low"]),
  evidenceUrls: z.array(z.string()),
});

export const EmergentBrandProfileSchema = z.object({
  signals: z.array(z.object({
    signal: z.string(),
    stated: z.string().describe("Verbatim text"),
    reinforced: z.string().describe("Emergent synthesis"),
    implied: z.string().describe("Behavioral inference"),
    evidenceUrls: z.array(z.string()),
    confidence: z.enum(["High", "Medium", "Low"]),
  })),
});

export const AudienceAndOfferClaritySchema = z.object({
  audienceClarityScore: z.number().min(0).max(10),
  audiences: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    notes: z.string().optional(),
  })),
  portfolioClarityScore: z.number().min(0).max(10),
  offers: z.array(z.object({
    name: z.string(),
    category: z.string().optional(),
    notes: z.string().optional(),
  })),
});

export const TrustStackSchema = z.object({
  trustReadinessScore: z.number().min(0).max(10),
  trustPoints: z.array(z.string()).describe("3 key bullets"),
  proofInventory: z.array(z.object({
    proofType: z.string(),
    example: z.string(),
    url: z.string(),
    nearPrimaryCta: z.boolean().nullable(),
  })),
});

export const ConversionPathSchema = z.object({
  conversionReadinessScore: z.number().min(0).max(10),
  primaryConversionGoal: z.string().nullable(),
  topCtaLabels: z.array(z.string()),
  frictions: z.array(z.string()),
  quickFixes: z.array(z.object({
    fix: z.string(),
    evidenceUrls: z.array(z.string()),
  })),
});

export const MachineViewSchema = z.object({
  machineViewClarityScore: z.number().min(0).max(10),
  alignmentGaps: z.array(z.string()),
  signals: z.array(z.object({
    signalType: z.string(),
    example: z.string(),
    url: z.string(),
    whatItTellsMachines: z.string(),
    alignmentWithHumanView: z.string(),
  })),
});

export const SimplicityScorecardSchema = z.object({
  dimensions: z.array(z.object({
    dimension: z.string(),
    score: z.number().min(0).max(10).nullable(),
    evidence: z.string().optional(), // Simply string here as per prompt table
    outsideInImplication: z.string().optional(),
  })),
});

export const DecisionJourneySchema = z.object({
  stages: z.array(z.object({
    stage: z.string(),
    whatSiteProvides: z.string(),
    gaps: z.string(),
    exampleUrls: z.array(z.string()),
  })),
});

export const CompetitorSnapshotSchema = z.object({
  competitorName: z.string(),
  summary: z.string().describe("120-180 words"),
  evidenceUrls: z.array(z.string()),
});

export const CompetitiveBenchmarkSchema = z.object({
  firstImpressionTable: z.array(z.object({
    brand: z.string(),
    clarity10s: z.string(),
    primaryCta: z.string(),
    trustPosture: z.string(),
    differentiationCue: z.string(),
    evidenceUrls: z.array(z.string()),
  })),
  categoryLanguage: z.object({
    sharedPhrases: z.array(z.object({ phrase: z.string(), usedBy: z.array(z.string()) })),
    clientOwnableLanguage: z.array(z.string()),
    competitorDistinctiveLanguage: z.array(z.object({ competitor: z.string(), phrases: z.array(z.string()) })),
  }),
  perceptualFieldMap: z.object({
    axes: z.object({
        x: z.enum(["Promise-led", "Proof-led"]),
        y: z.enum(["Functional-led", "Human-led"]),
    }),
    placements: z.array(z.object({
        brand: z.string(),
        xValue: z.number().min(-10).max(10).describe("-10 is Promise-led, 10 is Proof-led"),
        yValue: z.number().min(-10).max(10).describe("-10 is Functional-led, 10 is Human-led"),
        justification: z.string(),
    })),
  }),
  whiteSpaceAnalysis: z.array(z.object({
    territoryName: z.string(),
    whyWhitespace: z.string(),
    howClientClaimsIt: z.string(),
    evidenceUrls: z.array(z.string()),
  })).length(3),
});

export const EffectivenessScorecardSchema = z.object({
  scores: z.array(z.object({
    metric: z.string(), // e.g., Offer Clarity
    clientScore: z.number().min(0).max(10),
    competitors: z.array(z.object({ name: z.string(), score: z.number() })),
    rationale: z.string(),
  })),
});

export const ActionFrameworkSchema = z.object({
  actions: z.array(z.object({
    horizon: z.string(), // Quick Wins, Strategic Priorities
    actionType: z.string(),
    detail: z.array(z.string()), // Split by newlines
    metricToWatch: z.string(),
  })),
});

export const MiniAuditReportSchema = z.object({
  title: z.string(),
  scopeAndMethod: AuditScopeSchema,
  executiveSummary: ExecutiveSummarySchema,
  outsideInEntryTest: OutsideInEntryTestSchema,
  emergentBrandProfile: EmergentBrandProfileSchema,
  audienceAndOfferClarity: AudienceAndOfferClaritySchema,
  trustStackAndProof: TrustStackSchema,
  conversionPath: ConversionPathSchema,
  machineView: MachineViewSchema,
  simplicityScorecard: SimplicityScorecardSchema,
  decisionJourney: DecisionJourneySchema,
  competitorSnapshots: z.array(CompetitorSnapshotSchema),
  competitiveBenchmark: CompetitiveBenchmarkSchema,
  comparativeBrandEffectiveness: EffectivenessScorecardSchema,
  actionFramework: ActionFrameworkSchema,
  limitationsAndNextSteps: z.string(),
});

export type MiniAuditReport = z.infer<typeof MiniAuditReportSchema>;
