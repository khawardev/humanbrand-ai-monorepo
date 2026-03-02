
export type AgentRole = 'Orchestrator' | 'Extraction' | 'Compilation' | 'Strategy' | 'Competitive' | 'Bridge' | 'Report';

export interface AgentMetadata {
    id: string;
    name: string;
    role: AgentRole;
    description: string;
    inputs: string[];
    outputs: string[];
    dependencies: string[];
}

export const BRAND_OS_AGENTS: Record<string, AgentMetadata> = {
    'scrapers': {
        id: 'OI-SWARM',
        name: 'Data Collection Swarm',
        role: 'Extraction',
        description: 'Orchestrates the parallel collection of website and social channels (OI-01, OI-02, OI-03).',
        inputs: ['Target URLs', 'Social Handles'],
        outputs: ['Raw HTML', 'Social Feeds', 'Images'],
        dependencies: ['sa-00']
    },
    'sa-00': {
        id: 'SA-00',
        name: 'Setup Agent',
        role: 'Orchestrator',
        description: 'Initializes the engagement, creates the evidence ledger and corpus manifest.',
        inputs: ['Engagement Config'],
        outputs: ['evidence_ledger.json', 'corpus_manifest.json'],
        dependencies: []
    },
    'oi-01': {
        id: 'OI-01',
        name: 'Web Collector',
        role: 'Extraction',
        description: 'Extracts and parses content from target website URLs on a per-page basis.',
        inputs: ['Target URLs (Manifest)'],
        outputs: ['url_extraction.json'],
        dependencies: ['sa-00']
    },
    'oi-02': {
        id: 'OI-02',
        name: 'Image Analyzer',
        role: 'Extraction',
        description: 'Analyzes visual content from websites for tags/sentiment on a per-image basis.',
        inputs: ['Image URLs'],
        outputs: ['image_extraction.json'],
        dependencies: ['oi-01']
    },
    'oi-03': {
        id: 'OI-03',
        name: 'Social Collector',
        role: 'Extraction',
        description: 'Extracts posts and engagement data from social channels on a per-post basis.',
        inputs: ['Social Handles'],
        outputs: ['post_extraction.json'],
        dependencies: ['sa-00']
    },
    'comp-01': {
        id: 'COMP-01',
        name: 'Web Verbal Compiler',
        role: 'Compilation',
        description: 'Aggregates website text into a unified verbal bedrock.',
        inputs: ['url_extraction.json'],
        outputs: ['website_verbal_bedrock.json'],
        dependencies: ['oi-01']
    },
    'comp-02': {
        id: 'COMP-02',
        name: 'Web Visual Compiler',
        role: 'Compilation',
        description: 'Aggregates website imagery into a visual bedrock.',
        inputs: ['image_extraction.json'],
        outputs: ['website_visual_bedrock.json'],
        dependencies: ['oi-02']
    },
    'comp-03': {
        id: 'COMP-03',
        name: 'Social Compiler',
        role: 'Compilation',
        description: 'Aggregates social content into channel-specific bedrocks.',
        inputs: ['post_extraction.json'],
        outputs: ['social_channel_bedrock.json'],
        dependencies: ['oi-03']
    },
    'comp-04': {
        id: 'COMP-04',
        name: 'Social Visual Compiler',
        role: 'Compilation',
        description: 'Aggregates social visuals into a visual bedrock.',
        inputs: ['post_extraction.json'],
        outputs: ['social_visual_bedrock.json'],
        dependencies: ['oi-03']
    },
    'oi-10': {
        id: 'OI-10',
        name: 'Fact Analyst',
        role: 'Strategy',
        description: 'Distills indisputable facts about the entity.',
        inputs: ['Verbal Bedrocks'],
        outputs: ['fact_base.json'],
        dependencies: ['comp-01', 'comp-03']
    },
    'oi-11': {
        id: 'OI-11',
        name: 'Brand Strategist',
        role: 'Strategy',
        description: 'Synthesizes platform, archetype, narrative, and voice.',
        inputs: ['Verbal Bedrocks', 'Fact Base'],
        outputs: ['brand_platform.json', 'brand_archetype.json', 'brand_narrative.json', 'brand_voice.json'],
        dependencies: ['oi-10']
    },
    'oi-12': {
        id: 'OI-12',
        name: 'Content Strategist',
        role: 'Strategy',
        description: 'Analyzes content pillars and format performance.',
        inputs: ['Verbal Bedrocks', 'Social Bedrocks'],
        outputs: ['content_strategy.json'],
        dependencies: ['comp-01', 'comp-03']
    },
    'oi-13': {
        id: 'OI-13',
        name: 'Competitive Analyst',
        role: 'Competitive',
        description: 'Maps the competitive landscape and positioning.',
        inputs: ['Competitor Bedrocks'],
        outputs: ['positioning_landscape.json', 'category_grammar.json', 'topic_ownership.json', 'whitespace_analysis.json', 'competitor_playbooks.json'],
        dependencies: ['oi-11']
    },
    'oi-14': {
        id: 'OI-14',
        name: 'Consistency Analyst',
        role: 'Strategy',
        description: 'Evaluates consistency across channels.',
        inputs: ['Verbal Bedrocks', 'Social Bedrocks'],
        outputs: ['internal_consistency.json'],
        dependencies: ['comp-01', 'comp-03']
    },
    'oi-15': {
        id: 'OI-15',
        name: 'Market Voice Analyst',
        role: 'Strategy',
        description: 'Analyzes audience sentiment and needs.',
        inputs: ['Social Bedrocks'],
        outputs: ['voice_of_market.json'],
        dependencies: ['comp-03']
    },
    'oi-16': {
        id: 'OI-16',
        name: 'Visual Identity Analyst',
        role: 'Strategy',
        description: 'Decodes the visual identity system.',
        inputs: ['Visual Bedrocks'],
        outputs: ['visual_identity.json'],
        dependencies: ['comp-02', 'comp-04']
    },
    'oi-17': {
        id: 'OI-17',
        name: 'Visual Competitive Analyst',
        role: 'Competitive',
        description: 'Compares visual territories across competitors.',
        inputs: ['Visual Bedrocks (All)'],
        outputs: ['visual_competitive_analysis.json'],
        dependencies: ['oi-16']
    },
    'bridge-01': {
        id: 'BRIDGE-01',
        name: 'Bridge Agent',
        role: 'Bridge',
        description: 'Consolidates all synthesis into BAM Input Pack.',
        inputs: ['All Strategy Artifacts'],
        outputs: ['bam_input_pack.zip', 'gate_outputs.json'],
        dependencies: ['gate-03', 'gate-04']
    },
    'rpt-01': {
        id: 'RPT-01',
        name: 'Emergent Brand Reporter',
        role: 'Report',
        description: 'Generates the Emergent Brand Report.',
        inputs: ['brand_platform.json', 'brand_archetype.json'],
        outputs: ['emergent_brand_report.md'],
        dependencies: ['oi-11']
    },
    'rpt-02': {
        id: 'RPT-02',
        name: 'Channel Audit Reporter',
        role: 'Report',
        description: 'Generates Social Channel Audit Reports.',
        inputs: ['social_channel_bedrock.json'],
        outputs: ['audit_report.md'],
        dependencies: ['comp-03']
    },
    'rpt-03': {
        id: 'RPT-03',
        name: 'Landscape Reporter',
        role: 'Report',
        description: 'Generates Competitive Landscape Report.',
        inputs: ['positioning_landscape.json'],
        outputs: ['competitive_landscape_report.md'],
        dependencies: ['oi-13']
    },
    'rpt-04': {
        id: 'RPT-04',
        name: 'Consistency Reporter',
        role: 'Report',
        description: 'Generates Consistency Report.',
        inputs: ['internal_consistency.json'],
        outputs: ['consistency_report.md'],
        dependencies: ['oi-14']
    },
    'rpt-05': {
        id: 'RPT-05',
        name: 'Market Voice Reporter',
        role: 'Report',
        description: 'Generates Voice of Market Report.',
        inputs: ['voice_of_market.json'],
        outputs: ['voice_of_market_report.md'],
        dependencies: ['oi-15']
    },
    'rpt-06': {
        id: 'RPT-06',
        name: 'Visual Identity Reporter',
        role: 'Report',
        description: 'Generates Visual Identity Report.',
        inputs: ['visual_identity.json'],
        outputs: ['visual_identity_report.md'],
        dependencies: ['oi-16']
    },
    'rpt-07': {
        id: 'RPT-07',
        name: 'Visual Comp Reporter',
        role: 'Report',
        description: 'Generates Visual Competitive Report.',
        inputs: ['visual_competitive_analysis.json'],
        outputs: ['visual_competitive_report.md'],
        dependencies: ['oi-17']
    },
};
