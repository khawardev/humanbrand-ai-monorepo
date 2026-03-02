export const SCRAPS = 'Data Capture'
export const SCRAPE = 'Capture'
export const SCRAPED = 'Captured'
export const SCRAPING = 'Capturing'

export const MODELS = [
    { id: "claude-3-haiku", name: "Anthropic Claude 3 Haiku — 200K tokens" },
    { id: "claude-4-sonnet", name: "Anthropic Claude 4 Sonnet — 200K tokens" },
    { id: "claude-4-1-opus", name: "Anthropic Claude 4.1 Opus — 200K tokens" },
    { id: "claude-4-opus", name: "Anthropic Claude 4 Opus — 200K tokens" },
    { id: "deepseek-r1", name: "DeepSeek R1 — 128K tokens" },
    { id: "meta-llama4-scout", name: "Meta LLaMA 4 Scout — 3.5M tokens" },
    { id: "claude-3-5-sonnet", name: "Anthropic Claude 3.5 Sonnet — 200K tokens" },
    { id: "claude-3-sonnet", name: "Anthropic Claude 3 Sonnet — 200K tokens" },
    { id: "claude-3-7-sonnet", name: "Anthropic Claude 3.7 Sonnet — 200K tokens" },
]

export const BrandStages = [
    {
        id: "ccba",
        stage: "Stage 1",
        abbreviation: "CCBA",
        name: "Perception & Competitor Baseline Audit",
        audit: "CCBA Audits",
        previousAbbreviation: null,
        previousName: "No name change"
    },
    {
        id: "bvo",
        stage: "Stage 2",
        abbreviation: "BVO",
        name: "Brand Validation & Optimization",
        audit: "BVO Audits",
        previousAbbreviation: "BAM",
        previousName: "Brand Action Model"
    },
    {
        id: "cge",
        stage: "Stage 3",
        abbreviation: "CGE",
        name: "Content Generation Engine",
        audit: "CGE Audits",
        previousAbbreviation: "CAM",
        previousName: "Content Action Model"
    },
    {
        id: "cbc",
        stage: "Stage 4",
        abbreviation: "CBC",
        name: "Continual Brand Coherence",
        audit: "CBC Audits",
        previousAbbreviation: null,
        previousName: "This stage formalizes the concept referred to as the Learning Loop"
    }
]


export const agents = [
    { id: "1", name: "Stakeholder Questionnaire Insights Extractor & Analyst", description: "Analyzes insights from user-uploaded stakeholder questionnaire responses." },
    { id: "2", name: "Stakeholder Interview Insights & Human Dynamics Analyst", description: "Analyzes stakeholder interviews for insights and human dynamics from uploaded documents and context." },
    { id: "2-B", name: "Stakeholder Insight & Human Dynamics Synthesizer", description: "Synthesizes stakeholder insights from the previous agent's output, documents, and context." },
    { id: "3", name: "Audience Persona Insight & Human Dynamics Analyst", description: "Analyzes audience personas using brand website reports, social media reports, and context." },
    { id: "4", name: "Elite Audience Persona Architect", description: "Architects elite audience personas based on uploaded documents and context." },
    { id: "5", name: "Competitor Web Presence & Strategic Posture Analyst", description: "Analyzes competitors' web presence and strategic posture from synthesized website reports." },
    { id: "6", name: "Competitor Social Media Engagement & Tone Analyst", description: "Analyzes competitors' social media engagement and tone from social reports and context." },
    { id: "7", name: "Industry & Cultural Landscape Synthesizer", description: "Synthesizes industry and cultural landscape insights from uploaded documents and context." },
    { id: "8", name: "Competitive Landscape & Opportunity Synthesizer", description: "Synthesizes the competitive landscape to identify opportunities based on uploaded documents and context." },
    { id: "9", name: "Client Document Intelligence & Brand Consistency Analyst", description: "Analyzes client documents for intelligence and ensures brand consistency." },
    { id: "10", name: "Client Website Experience & Brand Alignment Auditor", description: "Audits client's website experience and brand alignment from synthesized reports and context." },
    { id: "11", name: "Client Social Media Performance & Brand Alignment Auditor", description: "Audits client's social media performance and brand alignment from social media reports and context." },
    { id: "12", name: "Foundational Brand Insight & Strategy Synthesis Engine", description: "Synthesizes brand insights and strategy from website reports, social reports, and context." },
    { id: "13", name: "Brand Platform Architect & Visionary Storyteller", description: "Architects the brand platform and visionary story from brand reports and uploaded documents." },
    { id: "14", name: "Strategic Brand Lexicon & Sensory Language Architect", description: "Architects a strategic brand lexicon and sensory language from uploaded documents and context." },
    { id: "15", name: "Brand Voice, Tone & Archetypal Expression Architect", description: "Architects the brand's voice, tone, and archetypal expression based on documents and context." },
    { id: "16", name: "Strategic Messaging Framework & Narrative Architect", description: "Architects a strategic messaging framework and narrative based on uploaded documents and context." },
    { id: "17", name: "Definitive Brand Platform Synthesizer & Guardian", description: "Synthesizes and guards the definitive brand platform, using the output of the Brand Platform Architect." },
    { id: "18", name: "Definitive Messaging Framework & Harmonized Lexicon Architect", description: "Architects the definitive messaging framework, using the output of the Brand Platform Synthesizer." },
    { id: "19", name: "Integrated Strategic Marketing Plan Architect", description: "Architects an integrated strategic marketing plan based on uploaded documents and context." },
    { id: "20", name: "Comprehensive Digital Marketing Activation Plan", description: "Creates a comprehensive digital marketing activation plan based on the strategic marketing plan." },
    { id: "21", name: "Platform-Specific Social Media Activation & Community Architecture Plan", description: "Creates a platform-specific social media activation and community plan from the marketing plan." },
];


export const executionModes = [
    { id: "interactive", label: "Interactive", description: "Step-by-step agent execution with your guidance." },
    { id: "independent", label: "Independent", description: "Run selected agents independently in parallel." },
    { id: "sequential", label: "Sequential", description: "Run the full pipeline sequentially, one agent after another." },
];