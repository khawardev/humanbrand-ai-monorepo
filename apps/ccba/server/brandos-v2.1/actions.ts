
'use server'

import { AgentState, CorpusManifest, EngagementConfig, EvidenceLedger, GateOutputs, EvidenceItem, CoverageGap, DataQualityFlag, CorpusAdequacy, WebsiteCoverage, ChannelCoverage, UrlExtraction, PostExtraction, ImageExtraction, WebsiteVerbalBedrock, WebsiteVisualBedrock, SocialChannelBedrock, SocialVisualBedrock, BrandPlatform, BrandArchetype, BrandVoice, FactBase, BrandNarrative, ContentStrategy, InternalConsistency, VoiceOfMarket, VisualIdentity, PositioningLandscape, ReportArtifact, CategoryGrammar, TopicOwnership, WhitespaceAnalysis, CompetitorPlaybook, VisualCompetitiveAnalysis } from '@/lib/brandos-v2.1/types';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import os from 'os';

// --- MOCK PERSISTENCE LAYER ---
const DB_PATH = path.join(os.tmpdir(), 'brandos_mock_db_v2.json');

type MockDB = {
    engagements: Record<string, EngagementConfig>;
    phaseStatus: Record<string, AgentState[]>; // key: engagementId_phase
    ledger: Record<string, EvidenceLedger>;
    manifest: Record<string, CorpusManifest>;
    gateResults: Record<string, GateOutputs>;
};

function getDB(): MockDB {
    try {
        if (fs.existsSync(DB_PATH)) {
            return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
        }
    } catch (e) {
        console.error("Error reading mock DB:", e);
    }
    return { engagements: {}, phaseStatus: {}, ledger: {}, manifest: {}, gateResults: {} };
}

function saveDB(db: MockDB) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    } catch (e) {
        console.error("Error writing mock DB:", e);
    }
}

// Helper to get/set status for a specific engagement and phase
function getPhaseStatus(engagementId: string, phase: string): AgentState[] {
    const db = getDB();
    return db.phaseStatus[`${engagementId}_${phase}`] || [];
}

function setPhaseStatus(engagementId: string, phase: string, status: AgentState[]) {
    const db = getDB();
    db.phaseStatus[`${engagementId}_${phase}`] = status;
    saveDB(db);
}

// Helper to generate IDs
const generateId = (prefix: string) => `${prefix}${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`;

export async function createEngagementAction(config: EngagementConfig): Promise<{ success: boolean; engagementId: string; error?: string }> {
  try {
    const engagementId = `eng-${Date.now()}`;
    
    // Persist engagement
    const db = getDB();
    db.engagements[engagementId] = config;
    saveDB(db);
    
    return { success: true, engagementId };
  } catch (error) {
    console.error('Failed to create engagement:', error);
    return { success: false, engagementId: '', error: 'Failed to create engagement' };
  }
}

export async function startPhase0Action(engagementId: string) {
  // Initialize agents
  const agents: AgentState[] = [
    { id: 'scrapers', name: 'Data Collection Swarm', status: 'running', progress: 0 },
    { id: 'sa-00', name: 'SA-00 Evidence Ledger Builder', status: 'idle', progress: 0 }
  ];

  setPhaseStatus(engagementId, 'phase0', agents);

  revalidatePath('/dashboard/brandos-v2.1/phase-0');
  return { success: true };
}

export async function pollPhase0StatusAction(engagementId: string): Promise<{ 
    agents: AgentState[], 
    ledger?: EvidenceLedger, 
    manifest?: CorpusManifest,
    gateResults?: GateOutputs,
    config?: EngagementConfig | null
}> {
  // Retrieve state
  let activePhaseStatus = getPhaseStatus(engagementId, 'phase0');
  
  // Auto-recover if empty state found
  if (activePhaseStatus.length === 0) {
      await startPhase0Action(engagementId);
      activePhaseStatus = getPhaseStatus(engagementId, 'phase0');
  }

  // Simulate progress
  const scrapersIndex = activePhaseStatus.findIndex(a => a.id === 'scrapers');
  if (scrapersIndex > -1) {
    const scraper = activePhaseStatus[scrapersIndex];
    if (scraper && scraper.status === 'running') {
      scraper.progress = Math.min(scraper.progress + 15, 100);
      if (scraper.progress >= 100) {
        scraper.status = 'completed';
        // Trigger SA-00
        const sa00Index = activePhaseStatus.findIndex(a => a.id === 'sa-00');
        if (sa00Index > -1) {
          const sa00Node = activePhaseStatus[sa00Index];
          if (sa00Node) sa00Node.status = 'running';
        }
      }
    }
  }

  const sa00Index = activePhaseStatus.findIndex(a => a.id === 'sa-00');
  if (sa00Index > -1) {
    const sa00 = activePhaseStatus[sa00Index];
    if (sa00 && sa00.status === 'running') {
      sa00.progress = Math.min(sa00.progress + 25, 100);
      if (sa00.progress >= 100) {
        sa00.status = 'completed';
      }
    }
  }
  
  // If SA-00 complete, return mock data
  let ledger, manifest, gateResults;
  
  // Retrieve config
  const db = getDB();
  const config = db.engagements[engagementId] || null;

  if (activePhaseStatus.find(a => a.id === 'sa-00')?.status === 'completed') {
    ledger = generateMockLedger(engagementId, config);
    manifest = generateMockManifest(engagementId, config, ledger);
    gateResults = generateMockGate0(engagementId, manifest);
  }

  // Save state
  setPhaseStatus(engagementId, 'phase0', activePhaseStatus);

  return { agents: activePhaseStatus, ledger, manifest, gateResults, config };
}

// --- PHASE 1 ACTIONS ---

// --- PHASE 1 ACTIONS ---

export async function startPhase1Action(engagementId: string) {
  // Initialize agents for Phase 1 - Expanded to match Inventory
  const agents: AgentState[] = [
    // Extraction Agents
    { id: 'oi-01', name: 'OI-01 Website Verbal Extractor', status: 'running', progress: 0 },
    { id: 'oi-02', name: 'OI-02 Visual Extractor', status: 'running', progress: 0 },
    { id: 'oi-03', name: 'OI-03 Social Post Extractor', status: 'running', progress: 0 },
    
    // Compilation Agents (Start as idle)
    { id: 'comp-01', name: 'COMP-01 Website Verbal Compiler', status: 'idle', progress: 0 },
    { id: 'comp-02', name: 'COMP-02 Website Visual Compiler', status: 'idle', progress: 0 },
    { id: 'comp-03', name: 'COMP-03 Social Channel Compiler', status: 'idle', progress: 0 },
    { id: 'comp-04', name: 'COMP-04 Social Visual Compiler', status: 'idle', progress: 0 }
  ];

  setPhaseStatus(engagementId, 'phase1', agents);

  revalidatePath('/dashboard/brandos-v2.1/phase-1');
  return { success: true };
}

export async function pollPhase1StatusAction(engagementId: string): Promise<{
    agents: AgentState[],
    extractions?: { url: UrlExtraction[], posts: PostExtraction[], images: ImageExtraction[] },
    bedrocks?: { website: WebsiteVerbalBedrock, website_visual: WebsiteVisualBedrock, social: SocialChannelBedrock, social_visual: SocialVisualBedrock },
    gate1Results?: GateOutputs,
    gate2Results?: GateOutputs
}> {
    // Retrieve state
    let activePhaseStatus = getPhaseStatus(engagementId, 'phase1');

    // Auto-recover
    if (activePhaseStatus.length === 0) {
        await startPhase1Action(engagementId);
        activePhaseStatus = getPhaseStatus(engagementId, 'phase1');
    }
    
    // Simulate Extraction Progress (OI-01, OI-02, OI-03)
    ['oi-01', 'oi-02', 'oi-03'].forEach(id => {
        const agent = activePhaseStatus.find(a => a.id === id);
        if (agent && agent.status === 'running') {
            agent.progress = Math.min(agent.progress + 20, 100);
            if (agent.progress >= 100) agent.status = 'completed';
        }
    });

    // Gate 1 Check (Runs after all extraction agents complete)
    const extractionsDone = ['oi-01', 'oi-02', 'oi-03'].every(id => activePhaseStatus.find(a => a.id === id)?.status === 'completed');
    let gate1Results;

    if (extractionsDone) {
        gate1Results = generateMockGate1(engagementId);
        
        // Trigger Compilers
        // COMP-01 needs OI-01; COMP-02 needs OI-02; COMP-03 needs OI-03; COMP-04 needs OI-02
        // Since all extractions are done, we can start all compilers
        ['comp-01', 'comp-02', 'comp-03', 'comp-04'].forEach(id => {
            const agent = activePhaseStatus.find(a => a.id === id);
            if (agent && agent.status === 'idle') agent.status = 'running';
        });
    }

    // Simulate Compilation Progress
    ['comp-01', 'comp-02', 'comp-03', 'comp-04'].forEach(id => {
        const agent = activePhaseStatus.find(a => a.id === id);
        if (agent && agent.status === 'running') {
            agent.progress = Math.min(agent.progress + 20, 100);
            if (agent.progress >= 100) agent.status = 'completed';
        }
    });

    // Gate 2 Check (Runs after compilations)
    const compilationsDone = ['comp-01', 'comp-02', 'comp-03', 'comp-04'].every(id => activePhaseStatus.find(a => a.id === id)?.status === 'completed');
    let gate2Results, extractions, bedrocks;

    if (compilationsDone) {
        gate2Results = generateMockGate2(engagementId);
        extractions = generateMockExtractions(engagementId);
        bedrocks = generateMockBedrocks(engagementId);
    }

    // Save state
    setPhaseStatus(engagementId, 'phase1', activePhaseStatus);

    return { agents: activePhaseStatus, extractions, bedrocks, gate1Results, gate2Results };
}

// --- PHASE 2 ACTIONS ---

export async function startPhase2Action(engagementId: string) {
  // Initialize agents for Phase 2 - Expanded to match Inventory
  const agents: AgentState[] = [
    // Synthesis Agents - Start with those having clear inputs from Phase 1
    { id: 'oi-10', name: 'OI-10 Fact Base Extractor', status: 'running', progress: 0 },
    { id: 'oi-11', name: 'OI-11 The Archaeologist', status: 'idle', progress: 0 }, // Removed "running" - usually depends on Fact Base
    { id: 'oi-12', name: 'OI-12 Content Strategist', status: 'running', progress: 0 },
    { id: 'oi-14', name: 'OI-14 The Cartographer', status: 'running', progress: 0 },
    { id: 'oi-15', name: 'OI-15 Comment Miner', status: 'running', progress: 0 },
    { id: 'oi-16', name: 'OI-16 Visual Identity Synthesizer', status: 'running', progress: 0 },
    
    // Dependent Synthesis Agents
    { id: 'oi-13', name: 'OI-13 The Strategist', status: 'idle', progress: 0 }, // Needs OI-11
    { id: 'oi-17', name: 'OI-17 Visual Intelligence Analyst', status: 'idle', progress: 0 }, // Needs OI-16

    // Report Generators
    { id: 'rpt-01', name: 'RPT-01 Emergent Brand Report', status: 'idle', progress: 0 }, // After OI-11
    { id: 'rpt-02', name: 'RPT-02 Channel Audit Report', status: 'running', progress: 0 }, // After COMP-03 (Immediate)
    { id: 'rpt-03', name: 'RPT-03 Competitive Landscape Report', status: 'idle', progress: 0 }, // After OI-13
    { id: 'rpt-04', name: 'RPT-04 Consistency Report', status: 'idle', progress: 0 }, // After OI-14
    { id: 'rpt-05', name: 'RPT-05 Voice of Market Report', status: 'idle', progress: 0 }, // After OI-15
    { id: 'rpt-06', name: 'RPT-06 Visual Identity Report', status: 'idle', progress: 0 }, // After OI-16
    { id: 'rpt-07', name: 'RPT-07 Visual Competitive Report', status: 'idle', progress: 0 } // After OI-17
  ];

  setPhaseStatus(engagementId, 'phase2', agents);

  revalidatePath('/dashboard/brandos-v2.1/phase-2');
  return { success: true };
}

export async function pollPhase2StatusAction(engagementId: string): Promise<{
  agents: AgentState[],
  synthesis?: {
      fact_base: FactBase;
      platform: BrandPlatform;
      archetype: BrandArchetype;
      brand_narrative: BrandNarrative;
      brand_voice: BrandVoice;
      content_strategy: ContentStrategy;
      internal_consistency: InternalConsistency;
      voice_of_market: VoiceOfMarket;
      visual_identity: VisualIdentity;
  },
  reports?: ReportArtifact[],
  gate3Results?: GateOutputs,
  gate4Results?: GateOutputs
}> {
  
  // Retrieve state
  let activePhaseStatus = getPhaseStatus(engagementId, 'phase2');

  // Auto-recover
  if (activePhaseStatus.length === 0) {
      await startPhase2Action(engagementId);
      activePhaseStatus = getPhaseStatus(engagementId, 'phase2');
  }

  // 0. Run OI-10 (Fact Analyst)
  const oi10 = activePhaseStatus.find(a => a.id === 'oi-10');
  if (oi10 && oi10.status === 'running') {
      oi10.progress = Math.min(oi10.progress + 25, 100);
      if (oi10.progress >= 100) oi10.status = 'completed';
  }

  // Trigger OI-11 after OI-10 completes
  if (activePhaseStatus.find(a => a.id === 'oi-10')?.status === 'completed') {
      const oi11 = activePhaseStatus.find(a => a.id === 'oi-11');
      if (oi11 && oi11.status === 'idle') oi11.status = 'running';
  }

  // 1. Run Initial Synthesis Agents
  ['oi-11', 'oi-12', 'oi-14', 'oi-15', 'oi-16', 'rpt-02'].forEach(id => {
       const agent = activePhaseStatus.find(a => a.id === id);
       if (agent && agent.status === 'running') {
           agent.progress = Math.min(agent.progress + 15, 100);
           if (agent.progress >= 100) agent.status = 'completed';
       }
  });

  // 2. Trigger Secondary Agents
  if (activePhaseStatus.find(a => a.id === 'oi-11')?.status === 'completed') {
      // Trigger OI-13 and RPT-01
      ['oi-13', 'rpt-01'].forEach(id => {
          const agent = activePhaseStatus.find(a => a.id === id);
           if (agent && agent.status === 'idle') agent.status = 'running';
      });
  }

  if (activePhaseStatus.find(a => a.id === 'oi-16')?.status === 'completed') {
      // Trigger OI-17 and RPT-06
      ['oi-17', 'rpt-06'].forEach(id => {
          const agent = activePhaseStatus.find(a => a.id === id);
           if (agent && agent.status === 'idle') agent.status = 'running';
      });
  }
  
  if (activePhaseStatus.find(a => a.id === 'oi-14')?.status === 'completed') {
       const rpt04 = activePhaseStatus.find(a => a.id === 'rpt-04');
       if (rpt04 && rpt04.status === 'idle') rpt04.status = 'running';
  }

   if (activePhaseStatus.find(a => a.id === 'oi-15')?.status === 'completed') {
       const rpt05 = activePhaseStatus.find(a => a.id === 'rpt-05');
       if (rpt05 && rpt05.status === 'idle') rpt05.status = 'running';
  }


  // 3. Run Secondary Agents
  ['oi-13', 'oi-17', 'rpt-01', 'rpt-06', 'rpt-04', 'rpt-05'].forEach(id => {
      const agent = activePhaseStatus.find(a => a.id === id);
       if (agent && agent.status === 'running') {
           agent.progress = Math.min(agent.progress + 20, 100);
           if (agent.progress >= 100) agent.status = 'completed';
       }
  });

  // 4. Trigger Tertiary Agents (Reports dependent on secondary synthesis)
  if (activePhaseStatus.find(a => a.id === 'oi-13')?.status === 'completed') {
       const rpt03 = activePhaseStatus.find(a => a.id === 'rpt-03');
       if (rpt03 && rpt03.status === 'idle') rpt03.status = 'running';
  }
  if (activePhaseStatus.find(a => a.id === 'oi-17')?.status === 'completed') {
       const rpt07 = activePhaseStatus.find(a => a.id === 'rpt-07');
       if (rpt07 && rpt07.status === 'idle') rpt07.status = 'running';
  }

  // 5. Run Tertiary Agents
   ['rpt-03', 'rpt-07'].forEach(id => {
      const agent = activePhaseStatus.find(a => a.id === id);
       if (agent && agent.status === 'running') {
           agent.progress = Math.min(agent.progress + 20, 100);
           if (agent.progress >= 100) agent.status = 'completed';
       }
  });


  const synthesisDone = activePhaseStatus.find(a => a.id === 'oi-11')?.status === 'completed';
  const allDone = activePhaseStatus.every(a => a.status === 'completed');

  let gate3Results, gate4Results, synthesis, reports;

  if (synthesisDone) {
      gate3Results = generateMockGate3(engagementId);
      synthesis = generateMockSynthesis(engagementId);
  }

  if (allDone) {
      gate4Results = generateMockGate4(engagementId);
      reports = generateMockReports(engagementId);
  }
  
  // Save state
  setPhaseStatus(engagementId, 'phase2', activePhaseStatus);

  return { agents: activePhaseStatus, synthesis, reports, gate3Results, gate4Results };
}



// --- FLOW E & F ACTIONS ---

// --- COMPARATIVE ACTIONS ---

// --- COMPARATIVE ACTIONS ---

export async function getComparativeDataAction(engagementId: string): Promise<{
    positioning_landscape: PositioningLandscape;
    category_grammar: CategoryGrammar;
    topic_ownership: TopicOwnership;
    whitespace_analysis: WhitespaceAnalysis;
    competitor_playbooks: CompetitorPlaybook;
    visual_competitive: VisualCompetitiveAnalysis;
} | null> {
    // Return mock comparative data
    return generateMockComparativeArtifacts(engagementId);
}

// ... (Other functions) ...

function generateMockReports(engagementId: string): ReportArtifact[] {
    const date = new Date().toISOString().split('T')[0];
    return [
        {
            report_type: "Emergent Brand Report",
            entity: "Client",
            generated_at: new Date().toISOString(),
            markdown_content: `
# The Emergent Brand: Client
## Outside-In Brand Perception Analysis

**Prepared by:** Humanbrand AI
**Analysis Date:** ${date}
**Corpus:** 150 website pages | 235 social posts | 127k words analyzed

---

## Executive Summary

Evidence suggests Client is positioning itself as a "Secure AI Leader," emphasizing trust and enterprise-grade capability. The dominant narrative is one of enabling innovation through safety.

However, a tension exists between technical authority (Language Pattern A) and approachable partnership (Language Pattern B). The brand alternates between "we build secure systems" and "we help you grow," without fully integrating these voices.

The most surprising finding is the strong "Sustainability" theme in audience engagement vs. its absence in official messaging.

---

## I. Brand Platform

### Mission
> "To revolutionize the industry through secure AI adoption."

**Confidence:** 0.90 — Validated by 12 "revolutionary" citations.

### Vision
> "A world where data is secure and intelligence is accessible."

**Confidence:** 0.85 — Consistent with forward-looking statements.

### Values

| Value | Description | Confidence |
|-------|-------------|------------|
| Integrity | Doing the right thing, always. | 0.95 |
| Innovation | Pushing boundaries. | 0.88 |
| Security | Protecting what matters. | 0.92 |

**Analysis:**
These values are inferred from behavioral patterns rather than explicit statements. "Security" emerges most strongly, appearing in 89 instances across product content.

---

## II. Brand Archetype

**Primary Archetype:** Ruler (Score: 0.85)
**Secondary Archetype:** Sage (Score: 0.65)

Client behaves as a Ruler—setting standards and asserting control over chaos. The Sage side appears in whitepapers and technical docs.

---

## III. Strategic Tensions

### Tension 1: Innovation vs. Safety
**Contradiction:** "Move fast" (Blog) vs. "Zero risk" (Homepage).
**Strategic Implication:** Needs a "Safe Velocity" narrative bridge.

---

## IV. Emergent Brand Summary

| Attribute | Synthesis | Confidence |
|-----------|-----------|------------|
| Mission | Secure AI adoption | 0.90 |
| Archetype | Ruler / Sage | 0.85 |
| Voice | Authoritative, Technical | 0.88 |

---

## Methodology Note
Analysis based on 150 pages and 235 posts collected via Brand OS.
`.trim()
        },
        {
            report_type: "Channel Audit Report",
            entity: "Client",
            generated_at: new Date().toISOString(),
            markdown_content: `
# LinkedIn Channel Audit: Client
## Social Media Performance & Content Analysis

**Prepared by:** Humanbrand AI
**Analysis Date:** ${date}

---

## Executive Summary
Client's LinkedIn serves as the primary professional engagement platform. The standout finding is that video content generates 70% higher engagement than images, yet represents only 10% of the mix.

---

## I. Channel Profile
| Metric | Value | vs. Competitors |
|--------|-------|-----------------|
| Followers | 45,000 | 2nd of 5 |
| Engagement | 0.14% | Below Average |

---

## II. Content Performance
**Top Performing Post:**
> "Our new rigorous security protocols..." (Video)
**Why it worked:** Direct addresses to customer pain points + high production value.

---

## III. Recommendations
1.  **Increase Video Output:** Shift resourcing to produce 2x weekly video clips.
2.  **Humanize the Feed:** Add employee spotlights to counter the "Corporate Ruler" persona.
`.trim()
        },
        {
            report_type: "Competitive Landscape Report",
            entity: "Cross-Entity",
            generated_at: new Date().toISOString(),
            markdown_content: `# Competitive Landscape Report
            
## Executive Summary
The market is bifurcated between "Legacy Giants" (Competitor A) and "Agile Disruptors" (Competitor B). The client occupies a unique "Secure Middle" ground but faces pressure from both sides.

## Market Map
*   **Competitor A**: Dominates the high-end enterprise market. Strength: Installed base. Weakness: Slow innovation.
*   **Competitor B**: Aggressively targeting SMBs with low pricing. Strength: Speed. Weakness: Reliability perception.

## Key Recommendation
Double down on the "Security" differentiator, as neither competitor owns this topic fully.
`.trim()
        },
        {
             report_type: "Consistency Report",
             entity: "Client",
             generated_at: new Date().toISOString(),
             markdown_content: `# Brand Consistency Report
             
## Scorecard
*   **Overall Consistency Score:** 78/100 (Good)
*   **Visual Consistency:** 92/100
*   **Verbal Consistency:** 65/100

## Analysis
The visual identity is strictly enforced across all channels. However, the verbal identity varies significantly. The website is formal and elevated, while social channels use inconsistent slang ("Awesome", "Cool") that dilutes the premium positioning.

## Action Plan
1.  Update social media guidelines to align with "Authoritative" tone key.
2.  Conduct training for community managers.
`.trim()
        },
        {
             report_type: "Voice of Market Report",
             entity: "Market",
             generated_at: new Date().toISOString(),
             markdown_content: `# Voice of Market Analysis
             
## Sentiment Drivers
*   **Positive:** Product reliability, Customer support responsiveness.
*   **Negative:** Pricing opacity, Documentation complexity.

## Unmet Needs
Customers are repeatedly asking for "Simplified deployment guides" in community forums. This represents a content opportunity.

## Topic Ownership
*   **Security:** Client (High Association)
*   **Ease of Use:** Competitor B (High Association)
`.trim()
        },
        {
             report_type: "Visual Identity Report",
             entity: "Client",
             generated_at: new Date().toISOString(),
             markdown_content: `# Visual Identity Analysis
             
## Palette Usage
*   **Primary Blue (#0F172A):** Used consistently as background.
*   **Accent Green:** Used for CTAs. Good contrast.

## Imagery
Imagery is 80% stock photography. Recommendation: Move to custom photography to build authenticity.

## Typography
Inter font family is legible but generic. Consider a display font for headers to add character.
`.trim()
        },
        {
            report_type: "Visual Competitive Report",
            entity: "Cross-Entity",
            generated_at: new Date().toISOString(),
            markdown_content: `
# Visual Competitive Landscape

## Overview
Visual analysis of 1,200+ images across Client and 3 Competitors.

## Territories
* **Client:** "Industrial Blue" - Heavy use of cool tones, machinery, and posed engineering shots.
* **Competitor A:** "Lifestyle Warmth" - Focus on end-users, warm lighting.
* **Competitor B:** "Abstract Tech" - Stock imagery, neon gradients.

## Gap Analysis
There is a clear whitespace for a "Human-Centric High Tech" visual style that combines reliability with warmth.
`.trim()
        }
    ];
}

// --- PHASE 3 (HANDOFF) ACTIONS ---

export async function startHandoffAction(engagementId: string) {
    const agents: AgentState[] = [
        { id: 'bridge-01', name: 'BRIDGE-01 BAM Input Pack Generator', status: 'running', progress: 0 }
    ];
    setPhaseStatus(engagementId, 'handoff', agents);
    revalidatePath('/dashboard/brandos-v2.1/export');
    return { success: true };
}

export async function pollHandoffStatusAction(engagementId: string): Promise<{
    agents: AgentState[],
    packageUrl?: string
}> {
    // Retrieve state
    let activePhaseStatus = getPhaseStatus(engagementId, 'handoff');

    // Auto-recover
    if (activePhaseStatus.length === 0) {
        await startHandoffAction(engagementId);
        activePhaseStatus = getPhaseStatus(engagementId, 'handoff');
    }

    const bridge = activePhaseStatus.find(a => a.id === 'bridge-01');
    if (bridge && bridge.status === 'running') {
        bridge.progress = Math.min(bridge.progress + 10, 100);
        if (bridge.progress >= 100) bridge.status = 'completed';
    }

    let packageUrl;
    if (bridge?.status === 'completed') {
        packageUrl = `https://brandos-artifacts.s3.amazonaws.com/${engagementId}/brandos_pack_v2.1.zip`;
    }

    // Save state
    setPhaseStatus(engagementId, 'handoff', activePhaseStatus);

    return { agents: activePhaseStatus, packageUrl };
}


// --- MOCK GENERATORS ---


function generateMockLedger(engagementId: string, config: EngagementConfig | null): EvidenceLedger {
    const evidenceItems: EvidenceItem[] = [];
    const evidenceByType = { webpage: 0, social_post: 0, comment: 0, image: 0 };
    const evidenceByEntity: Record<string, number> = {};

    const entities = config ? [config.details.clientName, ...config.competitors.map(c => c.name)] : ['AcmeCorp', 'CompetitorX'];
    
    let count = 0;
    
    entities.forEach(entity => {
        let entityCount = 0;
        const isClient = config && entity === config.details.clientName;
        const clientWebsite = isClient ? config.details.clientWebsite : null;
        const clientSocials = isClient ? config.details.clientSocials : null;

        // 1. Webpage Evidence
        const webCount = 2; 
        for (let i = 0; i < webCount; i++) {
            const baseUrl = clientWebsite || `https://${entity.toLowerCase().replace(/\s/g, '')}.com`;
            evidenceItems.push({
                evidence_id: `E${10000 + count}`,
                source_type: 'webpage',
                source_channel: 'website',
                source_entity: entity,
                source_url: `${baseUrl.replace(/\/$/, '')}/about`,
                source_timestamp: new Date(Date.now() - 86400000 * (i + 1)).toISOString(),
                content_type: 'text',
                excerpt: `The new AI-driven platform promises to revolutionize how enterprises handle data security, with a 99.9% reduction in false positives observed during the beta phase.`,
                full_content_uri: `s3://evidence-bucket/runs/${engagementId}/${entity}/web-${i}.html`,
                extraction_date: new Date().toISOString(),
                metadata: {
                    author: "Editorial Team",
                    word_count: 850 + (i * 100),
                    sentiment: {
                        polarity: { score: 0.85, label: "positive" },
                        emotional_tone: { primary: "professional", intensity: "high" },
                        subjectivity: { score: 0.2, label: "objective" }
                    }
                }
            });
            count++;
            entityCount++;
            evidenceByType.webpage++;
        }

        // 2. Social Post Evidence (Dynamic based on settings)
        const channelsToGen = ['linkedin', 'twitter', 'instagram'];
        
        channelsToGen.forEach((channel) => {
             // Only generate if we have a handle or it's a competitor (mock)
             const handle = clientSocials ? (clientSocials as any)[channel] : null;
             if (isClient && !handle) return; 

             const socialCount = 2; // Generate 2 posts per channel
             for (let i = 0; i < socialCount; i++) {
                const socialUrl = handle 
                    ? `https://${channel}.com/${handle.replace('@', '')}/status/${1000+i}`
                    : `https://${channel}.com/${entity}/status/${1000+i}`;

                evidenceItems.push({
                    evidence_id: `E${10000 + count}`,
                    source_type: 'social_post',
                    source_channel: channel as any,
                    source_entity: entity,
                    source_url: socialUrl,
                    source_timestamp: new Date(Date.now() - 43200000 * (i + 1)).toISOString(),
                    content_type: 'mixed',
                    excerpt: `We are thrilled to announce our Q3 results! #Growth #Innovation`,
                    full_content_uri: `s3://evidence-bucket/runs/${engagementId}/${entity}/${channel}-${i}.json`,
                    extraction_date: new Date().toISOString(),
                    metadata: {
                        likes: 450 + (i * 50),
                        shares: 32 + i,
                        sentiment: {
                            polarity: { score: 0.95, label: "very_positive" },
                            emotional_tone: { primary: "enthusiastic", intensity: "high" },
                            subjectivity: { score: 0.8, label: "subjective" }
                        }
                    }
                });
                count++;
                entityCount++;
                evidenceByType.social_post++;
             }
        });

        // 3. Comment Evidence (Negative example for variety)
        evidenceItems.push({
            evidence_id: `EC${40000 + count}`,
            source_type: 'comment',
            source_channel: 'facebook',
            source_entity: `${entity}_User`,
            source_url: `https://facebook.com/brand/posts/123?comment_id=${count}`,
            source_timestamp: new Date(Date.now() - 3600000).toISOString(),
            content_type: 'text',
            excerpt: "I've been waiting for support to email me back for 3 weeks. This is unacceptable service.",
            full_content_uri: `s3://evidence-bucket/runs/${engagementId}/${entity}/comment-${count}.json`,
            extraction_date: new Date().toISOString(),
            metadata: {
                parent_post_id: "888222111",
                sentiment: {
                    polarity: { score: -0.9, label: "very_negative" },
                    emotional_tone: { primary: "frustrated", intensity: "high" },
                    subjectivity: { score: 0.9, label: "subjective" }
                }
            }
        });
        count++;
        entityCount++;
        evidenceByType.comment++;

        evidenceByEntity[entity] = entityCount;
    });

    // Add a standalone Image evidence (Visual Analysis)
    evidenceItems.push({
        evidence_id: `VE05002`,
        source_type: 'image',
        source_channel: 'instagram',
        source_entity: 'LifestyleInfluencer',
        source_url: "https://instagram.com/p/CwXyZ123",
        source_timestamp: new Date(Date.now() - 7200000).toISOString(),
        content_type: 'image',
        excerpt: "[Visual Content Analysis]: Image contains the product placed on a marble table next to a coffee cup. Lighting is bright/morning sun. Logo is clearly visible.",
        full_content_uri: `s3://evidence-bucket/runs/${engagementId}/visual/VE05002.jpg`,
        extraction_date: new Date().toISOString(),
        metadata: {
            visual_tags: ["coffee", "morning", "lifestyle", "product_placement"],
            sentiment: {
                polarity: { score: 0.5, label: "positive" },
                emotional_tone: { primary: "neutral", intensity: "low" },
                subjectivity: { score: 0.1, label: "objective" }
            }
        }
    });
    evidenceByType.image++;
    // Add to first entity count for simplicity
    const firstEntity = entities[0] || 'Unknown';
    evidenceByEntity[firstEntity] = (evidenceByEntity[firstEntity] || 0) + 1;


    return {
        schema_version: "2.0.0" as const,
        generated_at: new Date().toISOString(),
        run_id: crypto.randomUUID(),
        tenant_id: "tenant-mock-123",
        evidence_count: evidenceItems.length,
        evidence_by_type: evidenceByType,
        evidence_by_entity: evidenceByEntity,
        evidence: evidenceItems
    };
}

function generateMockManifest(engagementId: string, config: EngagementConfig | null, ledger: EvidenceLedger): CorpusManifest {
    const entities = config ? [config.details.clientName, ...config.competitors.map(c => c.name)] : ['AcmeCorp', 'CompetitorX'];
    const runId = ledger.run_id;

    // Mock Coverage Data
    const websiteCoverage: Record<string, WebsiteCoverage> = {};
    const socialCoverage: Record<string, Record<string, ChannelCoverage>> = {};

    entities.forEach((entity, idx) => {
        // Vary data slightly
        const isClient = idx === 0;
        
        websiteCoverage[entity] = {
            pages_crawled: isClient ? 150 : 85,
            pages_excluded: isClient ? 12 : 5,
            total_words: isClient ? 85000 : 42000,
            total_images: isClient ? 320 : 150,
            status: isClient ? 'complete' : 'partial',
            exclusion_breakdown: isClient ? { "robots_txt": 10, "404_error": 2 } : { "duplicate_content": 5 }
        };

        socialCoverage[entity] = {
            linkedin: {
                posts_collected: isClient ? 25 : 0,
                comments_collected: isClient ? 150 : 0,
                total_engagement: isClient ? 4500 : 0,
                status: isClient ? 'complete' : 'no_presence'
            },
            x: {
                posts_collected: 110,
                comments_collected: 300,
                total_engagement: 8900,
                status: 'complete'
            }, 
            // Add a channel for CompetitorX
            ...( !isClient ? {
                instagram: {
                    posts_collected: 40,
                    comments_collected: 600,
                    total_engagement: 12000,
                    status: 'complete'
                }
            } : {})
        };
    });

    return {
        schema_version: "2.0.0" as const,
        generated_at: new Date().toISOString(),
        run_id: runId,
        collection_window: {
            collection_date: new Date().toISOString(),
            social_lookback_start: new Date(Date.now() - 30 * 86400000).toISOString(),
            social_lookback_end: new Date().toISOString(),
            social_lookback_days: 30
        },
        coverage_summary: {
            entities_collected: entities,
            channels_collected: ["website", "linkedin", "x", "instagram", "youtube"],
            website: websiteCoverage,
            social: socialCoverage
        },
        coverage_gaps: [
            {
                gap_id: "GAP001",
                entity: entities.length > 1 ? (entities[1] as string) : "CompetitorX",
                channel: "website",
                description: "Unable to crawl 'pricing' subdomain due to strict firewall rules.",
                severity: "significant",
                impact: "Missing pricing strategy data for analysis.",
                mitigation: "Manual intake of pricing PDF scheduled."
            },
            {
                gap_id: "GAP002",
                entity: entities[0] || "AcmeCorp",
                channel: "tiktok",
                description: "Brand has no official account or presence.",
                severity: "minor",
                impact: "Cannot analyze short-form video engagement.",
                mitigation: "None required (strategic decision)."
            }
        ],
        data_quality_flags: [
            {
                flag_id: "FLAG001",
                entity: entities[0] || "AcmeCorp",
                channel: "x",
                issue: "Rate limiting encountered during comment extraction.",
                affected_metrics: ["audience_sentiment_depth", "comment_volume"],
                handling: "Capped collection at 300 comments; statistical sampling applied."
            },
            {
                flag_id: "FLAG002",
                entity: entities.length > 1 ? (entities[1] as string) : "CompetitorX",
                channel: "website",
                issue: "High ratio of non-text content (images) without alt tags.",
                affected_metrics: ["keyword_density", "accessibility_score"],
                handling: "Visual analysis module triggered for image content extraction."
            }
        ],
        corpus_adequacy: {
            overall: "adequate",
            notes: "Sufficient data collected across primary channels to support confidence interval of 95%. Website coverage for CompetitorX is partial but core pages are present.",
            minimum_thresholds: {
                website_pages: 50,
                social_posts_per_channel: 10,
                comments_per_channel: 50
            },
            entities_below_threshold: []
        }
    };
}

function generateMockGate0(engagementId: string, manifest: CorpusManifest): GateOutputs {
    // Logic: Pass if adequate, warn if marginal/inadequate but passable
    const gateStatus = manifest.corpus_adequacy.overall === 'adequate' ? 'pass' : 'warn';

    return {
        schema_version: "2.0.0" as const,
        generated_at: new Date().toISOString(),
        engagement_id: engagementId,
        overall_status: gateStatus,
        gates: [
            {
                gate_id: "GATE-01",
                name: "Corpus Volume",
                status: gateStatus,
                messages: [
                    "Sufficient volume across all targets (95% CI suppported)",
                    `Website pages: ${Object.values(manifest.coverage_summary.website).reduce((a, b) => a + b.pages_crawled, 0)} collected`
                ],
                affected_files: ["corpus_manifest.json"]
            },
            {
                gate_id: "GATE-02",
                name: "Channel Diversity",
                status: "pass", // We hardcode pass here for the sample
                messages: [
                    "Primary channels (Website, LinkedIn, X) present for key entities"
                ],
                affected_files: ["corpus_manifest.json"]
            },
            {
                gate_id: "GATE-03",
                name: "Data Quality",
                status: "warn",
                messages: manifest.data_quality_flags.map(f => `FLAG: ${f.issue}`),
                affected_files: ["evidence_ledger.json"]
            }
        ]
    };
}

function generateMockGate1(engagementId: string): GateOutputs {
    return {
        schema_version: "2.0.0" as const,
        generated_at: new Date().toISOString(),
        engagement_id: engagementId,
        overall_status: 'pass',
        gates: [
            {
                gate_id: "GATE-1-1",
                name: "Extraction Quality",
                status: 'pass',
                messages: ["All URLs extracted with >95% success rate"],
                affected_files: ["url_extractions"]
            }
        ]
    };
}

function generateMockGate2(engagementId: string): GateOutputs {
    return {
        schema_version: "2.0.0" as const,
        generated_at: new Date().toISOString(),
        engagement_id: engagementId,
        overall_status: 'pass',
        gates: [
            {
                gate_id: "GATE-2-1",
                name: "Compilation Integrity",
                status: 'pass',
                messages: ["Bedrocks aggregated successfully"],
                affected_files: ["bedrocks"]
            }
        ]
    };
}

// --- MOCK GENERATION FUNCTIONS ---

function generateMockImageExtraction(): ImageExtraction[] {
    return [
        {
            image_id: "IMG-001",
            evidence_id: "VE-001",
            url: "https://example.com/hero.jpg",
            page_url: "https://example.com/home",
            analysis: {
                description: "Corporate team meeting in modern glass office with skyline view.",
                objects_detected: ["Person", "Laptop", "Whiteboard", "Window"],
                color_palette: ["#1A2B3C", "#FFFFFF", "#808080"],
                text_content: "Future of Work"
            }
        },
        {
            image_id: "IMG-002",
            evidence_id: "VE-002",
            url: "https://example.com/product.jpg",
            analysis: {
                description: "Close-up of AI server rack with blue LED lighting.",
                objects_detected: ["Server", "Cable", "Light"],
                color_palette: ["#0000FF", "#000000"],
            }
        }
    ];
}

function generateMockWebsiteVisualBedrock(): WebsiteVisualBedrock {
    return {
        schema_version: "2.0.0" as const,
        generated_at: new Date().toISOString(),
        entity: "Client",
        channel: "website",
        image_count: 145,
        color_palette: {
            primary: ["#0F172A", "#3B82F6"],
            secondary: ["#64748B", "#F8FAFC"]
        },
        imagery_style: {
            type: "Mixed",
            mood: "Professional, Technological, Trustworthy"
        }
    };
}

function generateMockSocialVisualBedrock(): SocialVisualBedrock {
    return {
        schema_version: "2.0.0" as const,
        generated_at: new Date().toISOString(),
        entity: "Client",
        channel: "linkedin",
        image_count: 85,
        video_count: 12,
        visual_themes: ["Office Life", "Conference Speaker", "Infographic"],
        color_dominance: ["#3B82F6", "#FFFFFF"]
    };
}

function generateMockFactBase(): FactBase {
    return {
         schema_version: "2.0.0" as const,
         generated_at: new Date().toISOString(),
         entity: "Client",
         facts: [
             { category: "founded", fact: "2015", source_type: "webpage", evidence_ids: ["E001"] },
             { category: "location", fact: "San Francisco, CA", source_type: "linkedin_profile", evidence_ids: ["E002"] },
             { category: "product", fact: "Enterprise Security Platform", source_type: "webpage", evidence_ids: ["E003"] }
         ]
    };
}

function generateMockBrandNarrative(): BrandNarrative {
    return {
        schema_version: "2.0.0" as const,
        generated_at: new Date().toISOString(),
        entity: "Client",
        narrative_arcs: [
            { name: "The Security Shield", description: "Protecting the enterprise from chaos.", status: "dominant" },
            { name: "AI Acceleration", description: "Moving fast with confidence.", status: "emerging" }
        ],
        core_tension: {
            description: "Innovation vs. Safety",
            side_a: "We move at the speed of AI.",
            side_b: "We guarantee zero-risk deployments."
        }
    };
}

function generateMockBrandVoice(): BrandVoice {
    return {
        schema_version: "2.0.0" as const,
        generated_at: new Date().toISOString(),
        entity: "Client",
        tone_profile: {
            primary_traits: ["Authoritative", "Technical", "Secure"],
            secondary_traits: ["Helpful", "Steady"]
        },
        dimensions: {
            formal_casual: 0.8,
            technical_accessible: 0.7,
            serious_playful: 0.9,
            traditional_modern: 0.6
        },
        lexicon: {
            signature_words: ["Robust", "Enterprise-grade", "Seamless"],
            avoided_words: ["Cheap", "Quick fix", "Hack"]
        }
    };
}

function generateMockContentStrategy(): ContentStrategy {
    return {
        schema_version: "2.0.0" as const,
        generated_at: new Date().toISOString(),
        entity: "Client",
        pillar_analysis: [
            { pillar: "Thought Leadership", current_weight: 0.2, recommended_weight: 0.4, gap: "Under-indexed vs Competitors" },
            { pillar: "Product Updates", current_weight: 0.6, recommended_weight: 0.3, gap: "Over-saturated" }
        ],
        format_recommendations: [
            { format: "Short-form Video", action: "increase", rationale: "High engagement, low volume currently." },
            { format: "Long-form Text", action: "decrease", rationale: "Low read-through rates." }
        ]
    };
}

function generateMockInternalConsistency(): InternalConsistency {
    return {
        schema_version: "2.0.0" as const,
        generated_at: new Date().toISOString(),
        entity: "Client",
        overall_score: 0.78,
        channel_consistency: {
            website: 0.85,
            linkedin: 0.75,
            instagram: 0.50
        },
        conflicts: [
            { issue: "Tone mismatch: Formal on web, slang on IG.", severity: "medium", evidence_ids: ["E999", "E888"] }
        ]
    };
}

function generateMockVoiceOfMarket(): VoiceOfMarket {
    return {
        schema_version: "2.0.0" as const,
        generated_at: new Date().toISOString(),
        entity: "Client",
        audience_sentiment: {
            overall: "Positive but Confused",
            drivers: ["Product Quality (Pos)", "Pricing Structure (Neg)"]
        },
        key_topics: [
            { topic: "Ease of Use", sentiment: "positive", volume: "high" },
            { topic: "Customer Support", sentiment: "negative", volume: "medium" }
        ],
        unmet_needs: ["Clearer pricing tier definitions", "Mobile app feature parity"]
    };
}

function generateMockVisualIdentity(): VisualIdentity {
    return {
        schema_version: "2.0.0" as const,
        generated_at: new Date().toISOString(),
        entity: "Client",
        palette: {
            dominant_colors: ["#0F172A", "#FFFFFF"],
            accent_colors: ["#3B82F6", "#10B981"]
        },
        typography: {
            primary_font_style: "Sans-Serif (Inter)",
            consistency_score: 0.95
        },
        imagery_guidelines: {
            subject_matter: ["Technology", "People working", "Abstract data"],
            mood: "Clean, Modern, Corporate"
        }
    };
}

function generateMockComparativeArtifacts(engagementId: string) {
    return {
        positioning_landscape: {
            schema_version: "2.0.0" as const,
            generated_at: new Date().toISOString(),
            matrix: [
                { entity: "Client", positioning: "Secure AI Leader", market_share_proxy: 0.15 },
                { entity: "Competitor A", positioning: "Legacy Enterprise", market_share_proxy: 0.45 },
                { entity: "Competitor B", positioning: "Cheap Alternative", market_share_proxy: 0.20 }
            ]
        },
        category_grammar: {
            schema_version: "2.0.0" as const,
            generated_at: new Date().toISOString(),
            cliches: ["Empower your business", "Seamless integration", "Next-gen"],
            must_win_terms: ["AI-native", "Zero-trust"],
            visual_tropes: ["Blue glowing nodes", "Handshakes"]
        },
        topic_ownership: {
             schema_version: "2.0.0" as const,
             generated_at: new Date().toISOString(),
             topics: [
                 { topic: "Security", owner: "Client", strength: 0.8 },
                 { topic: "Speed", owner: "Competitor B", strength: 0.9 },
                 { topic: "Reliability", owner: "Competitor A", strength: 0.7 }
             ]
        },
        whitespace_analysis: {
             schema_version: "2.0.0" as const,
             generated_at: new Date().toISOString(),
             unclaimed_territories: [
                 { name: "Friendly AI", description: "Accessible, human-centric AI partner.", viability: "high" as const }
             ]
        },
        competitor_playbooks: {
             schema_version: "2.0.0" as const,
             generated_at: new Date().toISOString(),
             competitor: "Competitor A",
             core_strategy: "Defend market share via bundle pricing.",
             strengths: ["Installed base", "Brand recognition"],
             weaknesses: ["Slow innovation", "Legacy UI"],
             predicted_next_move: "Acquisition of a smaller AI startup."
        },
        visual_competitive: {
            schema_version: "2.0.0" as const,
            generated_at: new Date().toISOString(),
            territories: [
                { entity: "Client", visual_territory: "Dark Mode Tech", key_elements: ["Dark backgrounds", "Neon accents"] },
                { entity: "Competitor A", visual_territory: "Corporate Blue", key_elements: ["Stock photos", "Blue overlays"] }
            ],
            gap_analysis: "Opportunity for 'Warm/Human' outlier visual style."
        }
    };
}

// Update Extractions Generator
function generateMockExtractions(engagementId: string): { url: UrlExtraction[], posts: PostExtraction[], images: ImageExtraction[] } {
    return {
        url: [
            {
                url_id: "URL-001",
                evidence_id: "E10001",
                url: "https://example.com/about",
                page_type: "about",
                text_content: "About us...",
                metadata: { word_count: 500 }
            }
        ],
        posts: [
            {
                post_id: "POST-001",
                evidence_id: "E10002",
                channel: "linkedin",
                entity: "Client",
                posted_at: new Date().toISOString(),
                content: "Excited to launch our new product!",
                engagement: { likes: 100, comments: 10, shares: 5 },
                classification: {
                    sentiment: { polarity: "positive", score: 0.9, emotional_tone: "Excited" },
                    purpose: "Product Launch",
                    format: "image"
                }
            }
        ],
        images: generateMockImageExtraction()
    };
}

// Update Bedrocks Generator
function generateMockBedrocks(engagementId: string): { website: WebsiteVerbalBedrock, website_visual: WebsiteVisualBedrock, social: SocialChannelBedrock, social_visual: SocialVisualBedrock } {
    return {
        website: {
            schema_version: "2.0.0" as const,
            generated_at: new Date().toISOString(),
            entity: "Client",
            channel: "website",
            corpus_summary: { pages_analyzed: 50, total_words: 25000 },
            linguistic_metrics: { avg_sentence_length: 15, reading_level_grade: 10 },
            lexical_frequency: { top_nouns: [{ word: "innovation", count: 120 }] },
            key_themes: [{ theme: "Sustainability", frequency: 45 }]
        },
        website_visual: generateMockWebsiteVisualBedrock(),
        social: {
            schema_version: "2.0.0" as const,
            generated_at: new Date().toISOString(),
            entity: "Client",
            channel: "linkedin",
            corpus_summary: { post_count: 120 },
            content_mix: { by_format: [{ format: "video", share: 0.4 }] },
            sentiment_summary: { avg_polarity_score: 0.8 },
            themes: [{ theme: "Leadership", share: 0.3 }]
        },
        social_visual: generateMockSocialVisualBedrock()
    };
}

// Update Synthesis Generation
function generateMockGate3(engagementId: string): GateOutputs {
    return {
        schema_version: "2.0.0" as const,
        generated_at: new Date().toISOString(),
        engagement_id: engagementId,
        overall_status: 'warn',
        gates: [
            {
                gate_id: "gate_3",
                name: "Synthesis Credibility",
                status: 'warn',
                messages: [
                    "Confidence Summary: Avg 0.78, Min 0.52",
                    "Evidence Density: 0.92 (Good)",
                    "WARN: Vision confidence 0.52 (Threshold: 0.60) - Limited future-oriented content",
                    "PASS: Mission confidence 0.90",
                    "PASS: Values confidence 0.92"
                ]
            }
        ]
    };
}

function generateMockGate4(engagementId: string): GateOutputs {
    return {
        schema_version: "2.0.0" as const,
        generated_at: new Date().toISOString(),
        engagement_id: engagementId,
        overall_status: 'pass',
        gates: [
            {
                gate_id: "gate_4",
                name: "Report Quality",
                status: 'pass',
                messages: [
                    "PASS: Structural Completeness (All sections present)",
                    "PASS: Evidence Citation Density (1.2 per 200 words)",
                    "PASS: No bullet points in narrative sections",
                    "PASS: Numbers match JSON source of truth"
                ]
            }
        ]
    };
}

function generateMockSynthesis(engagementId: string) {
    return {
        fact_base: generateMockFactBase(),
        platform: {
            schema_version: "2.0.0" as const,
            generated_at: new Date().toISOString(),
            entity: "Client",
            mission: { 
                synthesized: "To revolutionize the industry through secure AI adoption.", 
                confidence: 0.9,
                evidence_ids: ["E00101", "E00234"]
            },
            vision: { 
                synthesized: "A world where data is secure and intelligence is accessible.", 
                confidence: 0.85, 
                evidence_ids: ["E00342"]
            },
            values: { 
                synthesized: [
                    { value: "Integrity", description: "Doing the right thing, always.", confidence: 0.95, evidence_ids: ["E00991"] },
                    { value: "Innovation", description: "Pushing boundaries of what is possible.", confidence: 0.88, evidence_ids: ["E00992"] },
                    { value: "Security", description: "Protecting what matters most.", confidence: 0.92, evidence_ids: ["E00993"] }
                ] 
            },
            positioning: { 
                synthesized: "The leader in secure AI for enterprise.", 
                confidence: 0.88,
                evidence_ids: ["E00551", "E00552"]
            },
            tagline: { synthesized_alternative: "Secure AI for Everyone." },
            key_themes: [
                { name: "Safety First", score: 0.35, evidence_ids: ["E00111", "E00112"] },
                { name: "Enterprise Scale", score: 0.25, evidence_ids: ["E00113"] }
            ]
        },
        archetype: {
            schema_version: "2.0.0" as const,
            generated_at: new Date().toISOString(),
            entity: "Client",
            primary_archetype: { name: "The Sage", score: 0.8, description: "Driven by the search for truth and knowledge." },
            secondary_archetype: { name: "The Ruler", score: 0.15, description: "Focused on control and stability." }
        },
        brand_narrative: generateMockBrandNarrative(),
        brand_voice: generateMockBrandVoice(),
        content_strategy: generateMockContentStrategy(),
        internal_consistency: generateMockInternalConsistency(),
        voice_of_market: generateMockVoiceOfMarket(),
        visual_identity: generateMockVisualIdentity()
    };
}




