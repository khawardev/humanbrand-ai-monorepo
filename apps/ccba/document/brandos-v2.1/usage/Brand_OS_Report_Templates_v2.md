# Brand OS vNext: Human Layer Report Templates
## Complete Templates for Client-Facing Deliverables

**Version:** 2.1  
**Date:** December 22, 2025  
**Status:** Engineering Handoff Document

---

# Report Design Principles

## The Human Perception Frame

Every report answers: **"A senior brand strategist spent a week reading everything this brand publishes. What would they conclude?"**

This means:
- Write in strategic prose, not bullet points
- Lead with implications, not just findings
- Synthesize meaning, don't just report data
- Surface tensions prominently—they're the strategic gold
- Every finding answers "So what?"

## Writing Standards

1. **Prose over bullets** — Use paragraphs. Bullets only for summary tables.
2. **Strategic framing** — Don't say "We found X." Say "X reveals Y, which means Z."
3. **Evidence discipline** — Cite evidence IDs parenthetically, but don't let data overwhelm narrative.
4. **Confidence transparency** — State confidence levels honestly. "Low confidence" is better than false certainty.
5. **Tensions as features** — Contradictions are insights. Surface them prominently with both sides evidenced.
6. **Comparative context** — Client findings gain meaning when compared to competitors and category norms.
7. **Actionable implications** — Every section should suggest what to do (even if explicit recommendations come later).

## Report Structure Philosophy

Each report follows this pattern:
1. **Executive Summary** — Key insights a busy CMO needs in 2 minutes
2. **Strategic Sections** — Deep analysis with evidence
3. **Tensions/Anomalies** — Contradictions and surprises
4. **Summary Table** — At-a-glance reference
5. **Methodology Note** — What was analyzed, limitations

---

# Report 1: Emergent Brand Report

**File:** `reports/{entity}_emergent_brand_report.md`  
**Agent:** RPT-01 Emergent Brand Report Generator  
**Purpose:** Complete brand strategy synthesis for a single entity (client or competitor)  
**Audience:** CMO, Brand Team, Executive Leadership

---

```markdown
# The Emergent Brand: {{ENTITY_NAME}}
## Outside-In Brand Perception Analysis

**Prepared by:** Humanbrand AI  
**Analysis Date:** {{DATE}}  
**Corpus:** {{PAGE_COUNT}} website pages | {{POST_COUNT}} social posts | {{WORD_COUNT}} words analyzed

---

## Executive Summary

{{Write 2-3 paragraphs that capture:
- The essential character of this brand as it emerges from evidence
- The primary strategic tension or opportunity
- What makes this brand distinctive (or generic)
- One insight that would surprise the client

Example:
"Reading through Magna's digital presence, a visitor would come away believing this is a company that sees itself as the essential backbone of the automotive industry—the partner that makes the complex possible. The dominant narrative is one of transformation: from traditional manufacturing excellence toward technology-enabled mobility solutions.

However, there's an unresolved tension at the heart of this brand. The content oscillates between celebrating 65+ years of manufacturing heritage and claiming transformation leadership in software-defined vehicles. These two stories don't yet integrate into a unified narrative—the brand feels caught between its proven past and its aspirational future.

The most surprising finding: despite a major NVIDIA partnership announcement and clear SDV capabilities, software-defined vehicle content represents only 11.7% of share of voice—placing Magna 6th among competitors on the category's most critical emerging topic. The brand is underselling its most future-relevant capability."}}

---

## I. Brand Platform

### Mission
*What do we demonstrably do every day to create value?*

**Synthesized Mission:**  
> "{{MISSION_STATEMENT}}"

{{2-3 paragraphs explaining:
- How this mission emerged from the evidence
- What language patterns support it
- How it compares to stated mission (if any exists)
- What's notable or distinctive about it
- Strategic implications

Example:
"This mission synthesis emerges from consistent patterns across the website and social content. The phrase 'complete vehicle solutions' appears 34 times across 28 pages (E00023, E00067, E00112), while 'mobility technology company' anchors the about page opening and LinkedIn profile. The language consistently emphasizes integration and comprehensiveness—this is a company that defines itself by the breadth of what it can do, not the depth of any single capability.

Notably absent is customer-centric language. The mission focuses on what Magna does (deliver solutions, enable transformation) rather than the outcomes customers experience. This is a capability-first mission, which may limit emotional resonance with audiences seeking a partner who understands their challenges, not just their requirements."}}

**Confidence:** {{SCORE}} — {{Rationale: e.g., "Strong evidence from multiple sources with consistent language patterns"}}

---

### Vision
*What future reality are we actively trying to build?*

**Synthesized Vision:**  
> "{{VISION_STATEMENT}}"

{{Explanation paragraphs}}

**Confidence:** {{SCORE}} — {{Rationale}}

---

### Purpose
*Why does our work matter beyond profit?*

**Synthesized Purpose:**  
> "{{PURPOSE_STATEMENT}}"

{{Explanation paragraphs}}

**Confidence:** {{SCORE}} — {{Rationale}}

---

### Values
*What principles consistently guide behavior?*

**Synthesized Values:**

| Value | Description | Confidence |
|-------|-------------|------------|
| {{Value 1}} | {{Description}} | {{Score}} |
| {{Value 2}} | {{Description}} | {{Score}} |
| {{Value 3}} | {{Description}} | {{Score}} |
| {{Value 4}} | {{Description}} | {{Score}} |
| {{Value 5}} | {{Description}} | {{Score}} |

{{2-3 paragraphs explaining:
- How these values emerged from behavioral patterns
- What's emphasized vs. what's absent
- How they compare to any stated values
- Strategic implications

Example:
"These values are inferred from behavioral patterns rather than explicit statements—no values page exists on the website. The 'Safety First' value emerges most strongly, with safety-related language appearing in 89 instances across product and technology content. 'Collaborative Excellence' surfaces through the persistent 'partner' and 'together' language that frames nearly all customer-facing content.

Notably absent: any value around speed, agility, or disruption. The brand's values frame suggests a steady, reliable partner rather than a fast-moving innovator. This may be intentional—manufacturing excellence requires consistency—but creates tension with transformation narratives."}}

---

### Positioning
*What unique space do we occupy in audience minds?*

**Synthesized Positioning:**  
> "{{POSITIONING_STATEMENT}}"

{{Analysis paragraphs covering:
- The differentiation claim and its credibility
- Competitive context (who else claims similar)
- Proof points that substantiate the positioning
- Gaps between claim and evidence

Example:
"The positioning centers on 'complete vehicle capability'—a claim that only Magna among Tier-1 suppliers can credibly make due to Magna Steyr's contract manufacturing operations. This is a genuine differentiator, supported by 4+ million vehicles manufactured (E01234) and partnerships with premium OEMs for complete vehicle programs.

However, the positioning faces a tension: 'complete vehicle' emphasizes manufacturing breadth, while the industry conversation is moving toward software and technology integration. Competitors like Aptiv have claimed the 'brain and nervous system' positioning that may prove more relevant as vehicles become software-defined platforms. Magna's positioning is defensible today but may need evolution."}}

**Competitive Uniqueness:** {{HIGH/MEDIUM/LOW}} — {{Explanation}}

**Confidence:** {{SCORE}}

---

### Promise
*What core benefit do we deliver?*

**Synthesized Promise:**  
> "{{PROMISE_STATEMENT}}"

**Functional Benefit:** {{What the customer gets}}  
**Emotional Benefit:** {{How they feel}}

{{Analysis paragraphs}}

**Confidence:** {{SCORE}}

---

### Key Themes
*What are the narrative pillars of all communication?*

| Theme | Share of Voice | Strategic Role | Engagement Index |
|-------|----------------|----------------|------------------|
| {{Theme 1}} | {{X}}% | {{primary/differentiation/credibility/values}} | {{vs. average}} |
| {{Theme 2}} | {{X}}% | {{Role}} | {{vs. average}} |
| {{Theme 3}} | {{X}}% | {{Role}} | {{vs. average}} |
| {{Theme 4}} | {{X}}% | {{Role}} | {{vs. average}} |
| {{Theme 5}} | {{X}}% | {{Role}} | {{vs. average}} |

{{Analysis paragraphs covering:
- Theme balance and what it reveals about priorities
- Gaps between theme emphasis and audience engagement
- Comparison to competitor theme mix
- Strategic recommendations

Example:
"Five themes dominate the content ecosystem, but their distribution reveals strategic choices—and potential misalignments. 'Mobility Transformation' leads at 28.5% share of voice, appropriately given industry dynamics. However, 'Manufacturing Excellence' at 15.8% significantly trails 'Partnership Power' at 14.7%—suggesting the brand may be underselling its most distinctive capability in favor of generic relationship language.

The engagement data tells a different story. Despite modest share of voice, 'Sustainability' content generates 342% lift versus median engagement on LinkedIn. The audience wants more sustainability content than the brand is providing—a clear content strategy opportunity."}}

---

### Tagline
*What is the distilled strategic idea?*

**Explicit Tagline:** "{{TAGLINE}}"  
**Usage:** Found on {{X}} pages, {{Y}} social posts

{{Assessment paragraphs covering:
- What the tagline communicates
- How well it captures the brand essence
- Competitive distinctiveness
- Recommendations

Example:
"'Forward. For all.' effectively captures both the transformation narrative (Forward) and the accessibility/partnership positioning (For all). However, the tagline is generic enough to belong to multiple mobility companies—there's nothing distinctive that anchors it to Magna's specific capabilities or heritage.

Usage is inconsistent: the tagline appears prominently on the website but only in 23 of 248 LinkedIn posts. This inconsistency dilutes whatever recognition the tagline might build."}}

---

## II. Brand Archetype

**Primary Archetype:** {{ARCHETYPE}} (Confidence: {{SCORE}})  
**Secondary Archetype:** {{ARCHETYPE}} (Confidence: {{SCORE}})

{{3-4 paragraphs covering:
- How the primary archetype manifests in language, imagery, and behavior
- Evidence patterns that support the identification
- How the secondary archetype complements or creates tension
- Comparison to competitor archetypes
- Strategic implications

Example:
"Magna emerges primarily as the **Creator** archetype—the master builder who brings ideas into tangible reality. This manifests in language emphasizing 'build,' 'create,' 'develop,' and 'engineer' (234 combined instances), the visual emphasis on manufacturing facilities and precision equipment, and the persistent focus on capability and craft.

The secondary **Sage** archetype surfaces through expertise claims ('65+ years of expertise,' 'complete vehicle expertise') and technical authority language. This creates a 'wise builder' persona—someone who knows how to make things because they've been doing it for generations.

An interesting tension emerges with occasional **Hero** language ('transform mobility,' 'lead the future'), suggesting aspiration toward a more dynamic, world-changing archetype. Currently, this Hero energy appears in approximately 19% of content but doesn't integrate with the dominant Creator positioning. The brand oscillates between 'we build excellence' and 'we change the world' without reconciling these voices.

Competitively, Magna is the only primary Creator in the analyzed set—most competitors lead with Sage (Aptiv, Bosch) or Ruler (Continental). This is potentially distinctive but may feel less dynamic in an industry narrative dominated by transformation."}}

### Archetype Expression by Channel

| Channel | Primary | Secondary | Consistency |
|---------|---------|-----------|-------------|
| Website | {{Archetype}} | {{Archetype}} | {{High/Medium/Low}} |
| LinkedIn | {{Archetype}} | {{Archetype}} | {{High/Medium/Low}} |
| YouTube | {{Archetype}} | {{Archetype}} | {{High/Medium/Low}} |
| Instagram | {{Archetype}} | {{Archetype}} | {{High/Medium/Low}} |

{{Brief analysis of consistency or divergence across channels}}

---

## III. Brand Narrative

### The Story Structure

**The Hero:** {{Who the brand champions—usually the customer}}  
**The Antagonist:** {{What the brand fights against}}  
**The Core Tension:** {{The dramatic conflict at the heart of the story}}  
**The Resolution:** {{How the brand resolves the tension}}

{{3-4 paragraphs analyzing:
- The narrative structure and its effectiveness
- Whether the story is clearly told or fragmented
- How it compares to competitor narratives
- Whether the transformation promise is credible

Example:
"The brand tells a classic 'guide enables hero's journey' story: automakers (the hero) face overwhelming complexity in the transformation to electric, autonomous, connected mobility (the antagonist). Magna positions itself as the experienced guide who has navigated this terrain before and can simplify the journey.

This narrative structure is effective but not unique—it's the default story in B2B technology. What could differentiate is the specific 'how': Magna's complete vehicle capability means it can offer integration that component suppliers cannot. This proof point is present but underemphasized in the narrative.

The transformation promise—from complexity to confidence—is credible given the evidence base. However, the origin story is underutilized. The founding narrative and 65+ year journey could add emotional depth that pure capability claims cannot."}}

### Narrative Arcs

| Arc Name | Description | Frequency | Channels |
|----------|-------------|-----------|----------|
| {{Arc 1}} | {{Description}} | {{High/Medium/Low}} | {{Where it appears}} |
| {{Arc 2}} | {{Description}} | {{High/Medium/Low}} | {{Channels}} |
| {{Arc 3}} | {{Description}} | {{High/Medium/Low}} | {{Channels}} |

### The Transformation Promise

**Before:** {{Customer's situation before engaging with brand}}  
**After:** {{Customer's situation after}}  
**Mechanism:** {{How the brand enables this transformation}}  
**Credibility:** {{Assessment of whether the promise is believable}}

---

## IV. Brand Voice & Tone

### Personality

{{A vivid paragraph describing the brand as if it were a person. Be specific and evocative.

Example:
"If Magna were a person, it would be a seasoned master craftsman—think a Swiss watchmaker who's been perfecting their art for decades. Methodical, capable, and quietly confident. More comfortable showing than telling. Values precision and follow-through over flash. Speaks in complete sentences with technical fluency but doesn't showboat expertise. Approachable to those who share an appreciation for craft, but can feel reserved to those seeking warmth or inspiration. You'd trust this person to build something that works flawlessly; you might not invite them to deliver a keynote."}}

**Personality Keywords:** {{Keyword 1}}, {{Keyword 2}}, {{Keyword 3}}, {{Keyword 4}}, {{Keyword 5}}

### Voice Attributes
### Emotional Signature (Sentiment)

{{Summarize the emotional tone profile and sentiment polarity patterns across the brand's owned content. Include dominant emotional tone(s), typical intensity, and any notable sentiment shifts by topic or content type.}}

| Metric | Finding | Evidence |
|--------|---------|----------|
| Overall polarity | {{Score/Label}} | {{[e:ID]}} |
| Dominant emotional tone | {{Primary (Secondary)}} | {{[e:ID]}} |
| Tone intensity distribution | {{Low/Medium/High}} | {{[e:ID]}} |


**Primary Attributes:**

- **{{Attribute 1}}:** {{How it manifests in language with specific evidence. Example: "Technically Authoritative—uses industry terminology confidently ('ADAS,' 'SDV,' '800V architecture') without over-explanation, assumes audience technical literacy."}}

- **{{Attribute 2}}:** {{How it manifests}}

- **{{Attribute 3}}:** {{How it manifests}}

**Secondary Attributes:**

- **{{Attribute}}:** {{How it manifests}}

**Notably Absent:**

- **{{Attribute}}:** {{Why this absence is significant. Example: "Bold/Provocative—the voice never challenges conventions or makes contrarian claims. This creates a 'steady partner' impression but may limit memorability in a crowded market."}}

### Tonal Range

| Spectrum | Position | Evidence | Opportunity |
|----------|----------|----------|-------------|
| Formal ↔ Casual | {{X}}/5 | {{Brief evidence}} | {{Opportunity if any}} |
| Technical ↔ Accessible | {{X}}/5 | {{Evidence}} | {{Opportunity}} |
| Confident ↔ Humble | {{X}}/5 | {{Evidence}} | {{Opportunity}} |
| Serious ↔ Playful | {{X}}/5 | {{Evidence}} | {{Opportunity}} |

{{Analysis paragraph on cross-channel consistency and implications}}

### Lexicon

**Signature Vocabulary:**  
{{Terms that define this brand's language. Example: "'Complete vehicle,' 'systems integration,' 'mobility technology,' 'manufacturing excellence'—these phrases appear with unusual frequency and create a distinctive language fingerprint."}}

**Proprietary Terms:**  
{{Branded terminology. Example: "eDrive (powertrain technology), ClearView™ (mirror replacement), EcoSphere (sustainability program)—though usage of these branded terms is inconsistent."}}

**Overused Terms:**  
- "{{Term}}" appears {{X}} times — {{Assessment and recommendation}}
- "{{Term}}" appears {{X}} times — {{Assessment}}

**Conspicuously Absent:**  
- "{{Term}}" — {{Why this absence matters. Example: "'Disrupt' and 'revolutionary' are entirely absent, suggesting the brand avoids Silicon Valley-style language. This may be intentional (manufacturing credibility) or a missed opportunity (transformation narrative)."}}

### Rhetorical Style

**Persuasion Balance:**
- Logos (Logic): {{X}}%
- Ethos (Credibility): {{X}}%
- Pathos (Emotion): {{X}}%

{{Assessment. Example: "The brand relies heavily on logical argument (capability claims, technical specifications) and credibility appeals (experience, certifications, partnerships). Emotional appeal is minimal—limited to aspirational vision statements and sustainability messaging. This creates authority but may limit connection with audiences making decisions on factors beyond rational analysis."}}

**Claim-to-Evidence Ratio:** {{X}} claims per evidence point  
{{Assessment. Example: "A ratio of 2.8 suggests moderate substantiation—claims are made but could be better supported. Competitors like Aptiv achieve 1.5, with heavier emphasis on proof."}}

---

## V. Strategic Tensions & Anomalies

This section surfaces the contradictions, gaps, and inconsistencies that are often the most strategically significant findings. **Tensions are features, not bugs**—they reveal where strategic choices must be made.

---

### Tension 1: {{TENSION_NAME}}

**The Contradiction:**  
{{Clear description of the tension in 1-2 sentences}}

**Evidence for Side A:**
- "{{Verbatim quote}}" — {{Source}} ({{Evidence ID}})
- "{{Verbatim quote}}" — {{Source}} ({{Evidence ID}})
- Signal count: {{X}} instances

**Evidence for Side B:**
- "{{Verbatim quote}}" — {{Source}} ({{Evidence ID}})
- "{{Verbatim quote}}" — {{Source}} ({{Evidence ID}})
- Signal count: {{X}} instances

**Strategic Implication:**  
{{2-3 sentences on what this tension means for brand strategy. Example: "This tension between heritage and transformation is not inherently problematic—many successful brands integrate legacy and future. However, the current content oscillates between these positions without synthesis. The brand needs a unified narrative where heritage enables (rather than contradicts) transformation leadership."}}

---

### Tension 2: {{TENSION_NAME}}

{{Same structure}}

---

### Tension 3: {{TENSION_NAME}}

{{Same structure}}

---

### Anomalies

{{Any findings that don't fit patterns, surprising absences, or data that warrants attention. Example:

"**The NVIDIA Gap:** Despite announcing a major partnership with NVIDIA for software-defined vehicle development, SDV-related content represents only 11.7% of share of voice—placing this brand 6th among 10 competitors on what may be the category's most critical future topic. Either the partnership is newer than content strategy has adapted, or there's a strategic choice to undersell this capability. Either way, this is the largest gap between apparent capability and content emphasis in the corpus."}}

---

## VI. Emergent Brand Summary

| Attribute | Synthesis | Confidence |
|-----------|-----------|------------|
| **Mission** | {{One sentence}} | {{Score}} |
| **Vision** | {{One sentence}} | {{Score}} |
| **Purpose** | {{One sentence}} | {{Score}} |
| **Values** | {{3-5 keywords}} | {{Score}} |
| **Positioning** | {{One sentence}} | {{Score}} |
| **Promise** | {{One sentence}} | {{Score}} |
| **Key Themes** | {{Top 3}} | {{Score}} |
| **Tagline** | {{Line}} | {{Score}} |
| **Primary Archetype** | {{Archetype}} | {{Score}} |
| **Secondary Archetype** | {{Archetype}} | {{Score}} |
| **Voice** | {{3 keywords}} | {{Score}} |

---

## Methodology Note

This analysis synthesizes findings from:
- **Website corpus:** {{X}} pages, {{Y}} words, crawled {{DATE}}
- **Social media:** {{Channels analyzed}}, {{X}} posts, date range {{START}} to {{END}}
- **Comments analyzed:** {{X}} comments for Voice of Market insights
- **Images analyzed:** {{X}} images for visual identity assessment

All findings are grounded in publicly available digital content analyzed using the Brand OS Outside-In methodology. Confidence scores reflect evidence density and pattern consistency. Tensions are surfaced when contradictory evidence exists—resolution of tensions requires strategic choice, not data.

**Key Limitations:**
- Earned media (press, reviews) is out of scope for Phase 0-2 and is not included in this analysis
- Investor relations and careers content excluded from corpus
- Analysis reflects point-in-time snapshot; content may have changed

---

## Evidence Index

*Key evidence citations referenced in this report*

| ID | Source | Type | Excerpt |
|----|--------|------|---------|
| {{E00001}} | {{URL/Channel}} | {{webpage/post}} | "{{Brief quote}}" |
| {{E00002}} | {{URL/Channel}} | {{Type}} | "{{Quote}}" |
| ... | | | |

---
```

---

# Report 2: Social Channel Audit Report

**File:** `reports/{entity}_{channel}_audit_report.md`  
**Agent:** RPT-02 Channel Audit Report Generator  
**Purpose:** Deep analysis of a single social channel  
**Audience:** Social Media Team, Content Strategists

---

```markdown
# {{CHANNEL}} Channel Audit: {{ENTITY_NAME}}
## Social Media Performance & Content Analysis

**Prepared by:** Humanbrand AI  
**Analysis Date:** {{DATE}}  
**Analysis Period:** {{START_DATE}} to {{END_DATE}}

---

## Executive Summary

{{2-3 paragraphs covering:
- Channel's role in the brand ecosystem
- Key performance findings (what's working, what isn't)
- Primary content opportunity
- One actionable insight

Example:
"LinkedIn serves as Magna's primary professional engagement platform, with 425,000 followers and consistent posting cadence of 4-5 times weekly. The channel successfully balances product/technology content (27%) with culture/employer brand content (23%), creating a feed that speaks to both potential customers and potential employees.

The standout finding: sustainability content dramatically outperforms all other categories, generating 342% lift versus median engagement. Yet sustainability represents only 13.7% of content mix. This is the clearest content strategy opportunity—the audience is signaling strong interest that the brand is underserving.

The engagement challenge: despite consistent posting, engagement rate (0.14%) lags category benchmarks (0.25%). Video content, which represents only 18% of posts, generates 70% higher engagement than images. A format shift toward video could significantly improve channel performance."}}

---

## I. Channel Profile

### Account Overview

| Metric | Value | vs. Competitors |
|--------|-------|-----------------|
| Followers | {{X}} | {{Rank}} of {{Total}} |
| Following | {{X}} | — |
| Profile Completeness | {{Complete/Partial}} | — |
| Verified | {{Yes/No}} | — |

### Bio/About Analysis

**Current Bio:**  
> "{{Verbatim bio text}}"

**Bio Assessment:**  
{{Analysis of what bio communicates, whether it aligns with brand platform, what's missing}}

---

## II. Content Performance

### Posting Activity

| Metric | Value | Trend |
|--------|-------|-------|
| Posts in Period | {{X}} | — |
| Avg. Posts/Week | {{X}} | {{Increasing/Stable/Decreasing}} |
| Most Active Day | {{Day}} | — |
| Most Active Time | {{Time Range}} | — |
| Posting Consistency | {{High/Medium/Low}} | — |

{{Brief analysis of posting patterns and cadence consistency}}

### Engagement Performance

| Metric | Value | vs. Category |
|--------|-------|--------------|
| Total Engagement | {{X}} | — |
| Avg. Engagement/Post | {{X}} | {{Above/At/Below}} category avg |
| Median Engagement/Post | {{X}} | — |
| Engagement Rate | {{X}}% | {{Above/At/Below}} category avg |
| Engagement Trend | {{Direction}} | — |

**Engagement Breakdown:**

| Type | Total | Avg/Post | % of Engagement |
|------|-------|----------|-----------------|
| Likes | {{X}} | {{X}} | {{X}}% |
| Comments | {{X}} | {{X}} | {{X}}% |
| Shares | {{X}} | {{X}} | {{X}}% |

{{Analysis of engagement health and what it indicates about content resonance}}

---

## III. Content Mix Analysis

### By Format

| Format | Posts | % of Mix | Avg. Engagement | vs. Channel Avg |
|--------|-------|----------|-----------------|-----------------|
| Image | {{X}} | {{X}}% | {{X}} | {{+/-X}}% |
| Video | {{X}} | {{X}}% | {{X}} | {{+/-X}}% |
| Carousel | {{X}} | {{X}}% | {{X}} | {{+/-X}}% |
| Text Only | {{X}} | {{X}}% | {{X}} | {{+/-X}}% |
| Link | {{X}} | {{X}}% | {{X}} | {{+/-X}}% |

**Format Insight:**  
{{Analysis identifying underutilized high-performing formats. Example: "Video content represents only 18% of posts but generates 70% higher engagement than channel average. Carousel posts are even more underutilized (7%) despite strong engagement (+45%). The content mix is image-heavy (63%) despite images performing below average (-15%)."}}

### By Purpose

| Purpose | Posts | % of Mix | Avg. Engagement | vs. Channel Avg |
|---------|-------|----------|-----------------|-----------------|
| Product/Technology | {{X}} | {{X}}% | {{X}} | {{+/-X}}% |
| Company Culture | {{X}} | {{X}}% | {{X}} | {{+/-X}}% |
| Sustainability/ESG | {{X}} | {{X}}% | {{X}} | {{+/-X}}% |
| Partnerships | {{X}} | {{X}}% | {{X}} | {{+/-X}}% |
| Awards/Recognition | {{X}} | {{X}}% | {{X}} | {{+/-X}}% |
| Thought Leadership | {{X}} | {{X}}% | {{X}} | {{+/-X}}% |
| Events | {{X}} | {{X}}% | {{X}} | {{+/-X}}% |
| Recruitment | {{X}} | {{X}}% | {{X}} | {{+/-X}}% |

**Purpose Insight:**  
{{Analysis of content mix alignment with engagement. Example: "There's a significant mismatch between content investment and audience interest. Sustainability content (13.7% of posts) generates 342% engagement lift, while generic product posts (27% of posts) underperform by 35%. The audience is clearly signaling what they want more of."}}

---

## IV. Top Performing Posts

### #1: {{BRIEF DESCRIPTION}}

**Posted:** {{Date}}  
**Format:** {{Format}}  
**Purpose:** {{Purpose}}

**Content:**  
> "{{Post text excerpt or description}}"

**Performance:**
| Metric | Value | vs. Median |
|--------|-------|------------|
| Likes | {{X}} | +{{X}}% |
| Comments | {{X}} | +{{X}}% |
| Shares | {{X}} | +{{X}}% |
| **Total** | {{X}} | **+{{X}}%** |

**Why It Worked:**  
{{Analysis of success factors. Example: "This post combined three high-performing elements: (1) specific milestone with quantifiable achievement, (2) video format, (3) employee celebration angle. The combination of proof, format, and human connection drove exceptional engagement."}}

---

### #2: {{BRIEF DESCRIPTION}}

{{Same structure}}

---

### #3: {{BRIEF DESCRIPTION}}

{{Same structure}}

---

## V. Engagement Drivers

{{Analysis of patterns that correlate with high engagement}}

| Driver | Pattern | Lift vs. Median | Post Count | Replicable? |
|--------|---------|-----------------|------------|-------------|
| {{Driver 1}} | {{Description}} | +{{X}}% | {{X}} | {{Yes/Partially/No}} |
| {{Driver 2}} | {{Description}} | +{{X}}% | {{X}} | {{Yes/Partially/No}} |
| {{Driver 3}} | {{Description}} | +{{X}}% | {{X}} | {{Yes/Partially/No}} |

### Engagement Killers

| Pattern | Performance vs. Median | Recommendation |
|---------|------------------------|----------------|
| {{Pattern 1}} | -{{X}}% | {{Recommendation}} |
| {{Pattern 2}} | -{{X}}% | {{Recommendation}} |

---

## VI. Hashtag Strategy

### Most Used Hashtags

| Hashtag | Count | Avg. Engagement | Branded? |
|---------|-------|-----------------|----------|
| {{#Hashtag1}} | {{X}} | {{X}} | {{Yes/No}} |
| {{#Hashtag2}} | {{X}} | {{X}} | {{Yes/No}} |
| {{#Hashtag3}} | {{X}} | {{X}} | {{Yes/No}} |

### Branded Hashtag Performance

| Hashtag | Count | Consistency | Recommendation |
|---------|-------|-------------|----------------|
| {{#BrandedTag}} | {{X}} | {{High/Medium/Low}} | {{Assessment}} |

{{Analysis of hashtag strategy effectiveness}}

---

## VII. Theme Analysis

### Theme Distribution

| Theme | Posts | % Share | Engagement Index | Trend |
|-------|-------|---------|------------------|-------|
| {{Theme 1}} | {{X}} | {{X}}% | {{X}} | {{↑/→/↓}} |
| {{Theme 2}} | {{X}} | {{X}}% | {{X}} | {{↑/→/↓}} |
| {{Theme 3}} | {{X}} | {{X}}% | {{X}} | {{↑/→/↓}} |

### Theme Concentration

| Metric | Value | Assessment |
|--------|-------|------------|
| Top 3 Themes Share | {{X}}% | {{Assessment}} |
| Theme Diversity Score | {{X}} | {{Assessment}} |

{{Analysis of whether theme mix is appropriately diverse or too concentrated}}

---


## VIII. Sentiment & Emotional Tone

{{Summarize the sentiment polarity and emotional tone of the brand's posts on this channel. Include any meaningful differences by content format or theme.}}

### Polarity Distribution

| Label | Share | Notes |
|-------|-------|-------|
| Very positive | {{%}} | {{Notes}} |
| Positive | {{%}} | {{Notes}} |
| Neutral | {{%}} | {{Notes}} |
| Negative | {{%}} | {{Notes}} |
| Very negative | {{%}} | {{Notes}} |

### Emotional Tone Profile

| Tone | Intensity | Share | Typical contexts |
|------|-----------|-------|------------------|
| {{Tone 1}} | {{Low/Medium/High}} | {{%}} | {{Contexts}} |
| {{Tone 2}} | {{Low/Medium/High}} | {{%}} | {{Contexts}} |
| {{Tone 3}} | {{Low/Medium/High}} | {{%}} | {{Contexts}} |

## IX. Value Driver Coverage

| Driver | Posts | % Share | Engagement | vs. Competitors |
|--------|-------|---------|------------|-----------------|
| {{Electrification}} | {{X}} | {{X}}% | {{X}} | {{Rank}} |
| {{ADAS/Autonomy}} | {{X}} | {{X}}% | {{X}} | {{Rank}} |
| {{SDV}} | {{X}} | {{X}}% | {{X}} | {{Rank}} |
| {{Sustainability}} | {{X}} | {{X}}% | {{X}} | {{Rank}} |
| {{Lightweighting}} | {{X}} | {{X}}% | {{X}} | {{Rank}} |

**Value Driver Insight:**  
{{Analysis of whether content strategy aligns with industry priorities and competitive positioning}}

---

## X. Competitive Benchmarks

### Channel Metrics Comparison

| Entity | Followers | Posts/Week | Engagement Rate | Content Focus |
|--------|-----------|------------|-----------------|---------------|
| {{Client}} | {{X}} | {{X}} | {{X}}% | {{Primary theme}} |
| {{Competitor 1}} | {{X}} | {{X}} | {{X}}% | {{Primary theme}} |
| {{Competitor 2}} | {{X}} | {{X}} | {{X}}% | {{Primary theme}} |

### What Competitors Do Better

{{Analysis of competitor strengths to learn from}}

### Where Client Leads

{{Analysis of client advantages to amplify}}

---

## XI. Recommendations

### Quick Wins (Next 30 Days)

1. **{{Recommendation}}** — {{Rationale and expected impact}}
2. **{{Recommendation}}** — {{Rationale}}
3. **{{Recommendation}}** — {{Rationale}}

### Strategic Shifts (Next Quarter)

1. **{{Recommendation}}** — {{Rationale}}
2. **{{Recommendation}}** — {{Rationale}}

### Content Calendar Implications

{{Specific suggestions for content mix adjustments}}

---

## Methodology Note

**Analysis Period:** {{START}} to {{END}} ({{X}} days)  
**Posts Analyzed:** {{X}}  
**Comments Analyzed:** {{X}}  
**Competitor Benchmark Set:** {{List}}

---
```

---

# Report 3: Visual Identity Report

**File:** `reports/{entity}_visual_identity_report.md`  
**Agent:** RPT-06 Visual Identity Report Generator  
**Purpose:** Visual brand identity analysis across all channels  
**Audience:** Brand Team, Creative Directors, Design Leads

---

```markdown
# Visual Identity Analysis: {{ENTITY_NAME}}
## Cross-Channel Visual Brand Assessment

**Prepared by:** Humanbrand AI  
**Analysis Date:** {{DATE}}  
**Images Analyzed:** {{TOTAL_IMAGES}} across {{CHANNEL_COUNT}} channels

---

## Executive Summary

{{2-3 paragraphs covering:
- Overall visual identity coherence
- Distinctive visual assets
- Primary visual opportunity or gap
- Comparison to competitive visual landscape

Example:
"Magna's visual identity presents as professional and industrially competent, anchored by a consistent navy-blue and gray palette that appears across 85% of analyzed imagery. The photography style—bright, clean industrial editorial—successfully communicates manufacturing precision and scale.

However, the visual system lacks distinctiveness in the competitive context. Six of nine analyzed competitors use similar blue-dominant palettes. The angular gradient device that appears in 45 images represents the strongest ownable visual element, but its usage is inconsistent—present on website headers but rarely in social imagery.

The most significant gap: people representation skews heavily toward factory floors and formal executive portraits, with minimal lifestyle or candid imagery. This creates a visual system that communicates capability but not culture or human connection—a potential misalignment with the 'people-first' messaging that appears in verbal content."}}

---

## I. Color System

### Dominant Palette

| Role | Color | Hex | Usage % | Signal |
|------|-------|-----|---------|--------|
| Primary | {{Name}} | {{#XXXXXX}} | {{X}}% | {{What it communicates}} |
| Secondary | {{Name}} | {{#XXXXXX}} | {{X}}% | {{Signal}} |
| Accent 1 | {{Name}} | {{#XXXXXX}} | {{X}}% | {{Signal}} |
| Accent 2 | {{Name}} | {{#XXXXXX}} | {{X}}% | {{Signal}} |

### Color Temperature

| Classification | % of Images | Assessment |
|----------------|-------------|------------|
| Cool | {{X}}% | — |
| Neutral | {{X}}% | — |
| Warm | {{X}}% | — |

**Overall Temperature:** {{Cool/Balanced/Warm}}

### Cross-Channel Color Consistency

| Channel Pair | Consistency Score | Notes |
|--------------|-------------------|-------|
| Website ↔ LinkedIn | {{X}}/100 | {{Notes}} |
| Website ↔ YouTube | {{X}}/100 | {{Notes}} |
| Website ↔ Instagram | {{X}}/100 | {{Notes}} |
| LinkedIn ↔ Instagram | {{X}}/100 | {{Notes}} |

**Overall Color Consistency:** {{Score}}/100

{{Analysis of palette effectiveness and competitive differentiation}}

### Competitive Color Context

| Entity | Primary Color | Differentiation |
|--------|---------------|-----------------|
| {{Client}} | {{Color}} | — |
| {{Competitor 1}} | {{Color}} | {{Similar/Different}} |
| {{Competitor 2}} | {{Color}} | {{Similar/Different}} |

{{Analysis of whether color differentiates or blends with category}}

---

## II. Photography Style

### Dominant Style

**Primary:** {{Style}} ({{X}}% of images)  
**Secondary:** {{Style}} ({{X}}% of images)

### Style Attributes

| Attribute | Dominant | Distribution |
|-----------|----------|--------------|
| Treatment | {{Natural/Filtered/etc.}} | {{Breakdown}} |
| Lighting | {{Bright/Dramatic/etc.}} | {{Breakdown}} |
| Composition | {{Style}} | {{Breakdown}} |
| Quality | {{Professional/Mixed/etc.}} | {{Breakdown}} |

### Stock vs. Custom Assessment

| Classification | % of Images | Notes |
|----------------|-------------|-------|
| Likely Custom | {{X}}% | {{Notes}} |
| Possibly Stock | {{X}}% | {{Notes}} |
| Likely Stock | {{X}}% | {{Notes}} |

**Stock Assessment:**  
{{Analysis of stock usage and its impact on authenticity perception}}

---

## III. Subject Matter Distribution

### Overall Distribution

| Subject | % of Images | Top Channel | Notes |
|---------|-------------|-------------|-------|
| People | {{X}}% | {{Channel}} | {{Notes}} |
| Products | {{X}}% | {{Channel}} | {{Notes}} |
| Facilities | {{X}}% | {{Channel}} | {{Notes}} |
| Equipment | {{X}}% | {{Channel}} | {{Notes}} |
| Abstract/Graphics | {{X}}% | {{Channel}} | {{Notes}} |

### People Representation

| Attribute | Finding | Assessment |
|-----------|---------|------------|
| Roles Depicted | {{List}} | {{Assessment}} |
| Primary Context | {{Working/Posed/Candid/etc.}} | {{Assessment}} |
| Gender Balance | {{X}}% M / {{X}}% F | {{Assessment}} |
| Visible Diversity | {{High/Moderate/Limited}} | {{Assessment}} |
| Age Range | {{Description}} | {{Assessment}} |

**People Representation Assessment:**  
{{Analysis of whether people imagery aligns with brand values and messaging. Example: "Imagery heavily features factory workers (34%) and engineers (28%), with executives appearing in 15% of people images. This creates an authentic 'industrial' feel but may miss opportunities to show customer outcomes or end-user benefit. Notably absent: customer-facing imagery or lifestyle context showing vehicles in use."}}

### Product Presentation

| Presentation Style | % of Product Images |
|--------------------|---------------------|
| In-Context | {{X}}% |
| Isolated Hero | {{X}}% |
| Detail/Closeup | {{X}}% |

### Facility Imagery

| Facility Type | % of Facility Images |
|---------------|---------------------|
| Manufacturing Floor | {{X}}% |
| R&D/Lab | {{X}}% |
| Office | {{X}}% |
| Exterior | {{X}}% |

---

## IV. Visual Templates & Systems

### Template Usage

| Template | Description | Frequency | Consistency |
|----------|-------------|-----------|-------------|
| {{Template 1}} | {{Description}} | {{X}} uses | {{High/Medium/Low}} |
| {{Template 2}} | {{Description}} | {{X}} uses | {{High/Medium/Low}} |

**Template System Assessment:**  
{{Analysis of whether consistent templates exist and are properly applied}}

### Cross-Channel Template Consistency

| Assessment | Score | Notes |
|------------|-------|-------|
| Template Existence | {{Exists/Partial/None}} | — |
| Template Application | {{Consistent/Variable/Inconsistent}} | — |
| Recognizability | {{High/Medium/Low}} | — |

---

## V. Distinctive Visual Assets

### Ownable Elements

| Asset | Description | Frequency | Distinctiveness | Ownable? |
|-------|-------------|-----------|-----------------|----------|
| {{Asset 1}} | {{Description}} | {{X}} uses | {{High/Medium/Low}} | {{Yes/Partially/No}} |
| {{Asset 2}} | {{Description}} | {{X}} uses | {{High/Medium/Low}} | {{Yes/Partially/No}} |

**Distinctiveness Assessment:**  
{{Analysis of which visual elements could become ownable brand assets}}

### Category Clichés Used

| Cliché | Frequency | Recommendation |
|--------|-----------|----------------|
| {{Cliché 1}} | {{X}} uses | {{Reduce/Replace}} |
| {{Cliché 2}} | {{X}} uses | {{Reduce/Replace}} |

---

## VI. Logo Behavior

### Logo Usage

| Metric | Value |
|--------|-------|
| Images with Logo | {{X}}% |
| Primary Placement | {{Position}} |
| Versions Used | {{List}} |
| Consistency | {{High/Medium/Low}} |

### Logo Usage by Channel

| Channel | Logo Presence | Placement Consistency |
|---------|---------------|----------------------|
| Website | {{X}}% | {{Assessment}} |
| LinkedIn | {{X}}% | {{Assessment}} |
| YouTube | {{X}}% | {{Assessment}} |
| Instagram | {{X}}% | {{Assessment}} |

---

## VII. Visual Tensions

### Tension 1: {{TENSION_NAME}}

**The Inconsistency:**  
{{Description. Example: "Website imagery uses cooler, more saturated blues while Instagram uses warmer, more lifestyle-oriented tones."}}

**Evidence:**  
- {{Specific examples with image references}}

**Impact:**  
{{Assessment of whether this tension is problematic or intentional channel adaptation}}

---

## VIII. Competitive Visual Position

### Visual Distinctiveness vs. Competitors

| Entity | Primary Palette | Photography Style | Distinctiveness |
|--------|----------------|-------------------|-----------------|
| {{Client}} | {{Palette}} | {{Style}} | {{Score}}/10 |
| {{Competitor 1}} | {{Palette}} | {{Style}} | {{Score}}/10 |
| {{Competitor 2}} | {{Palette}} | {{Style}} | {{Score}}/10 |

### Visual Whitespace

{{Opportunities for visual differentiation that no competitor has claimed}}

---

## IX. Recommendations

### Amplify

{{Visual elements to use more consistently and prominently}}

### Reduce

{{Visual clichés or inconsistent elements to minimize}}

### Introduce

{{New visual approaches that would differentiate}}

### "Brand Would Never"

{{Visual choices that should be explicitly prohibited}}

---

## Methodology Note

**Images Analyzed:** {{Total}} across {{Channels}}  
**Analysis Method:** Vision model classification with human review  
**Competitive Set:** {{List}}

---
```

---

# Report 4: Competitive Landscape Report

**File:** `reports/competitive_landscape_report.md`  
**Agent:** RPT-03 Competitive Landscape Report Generator  
**Purpose:** Strategic competitive intelligence across all analyzed entities  
**Audience:** Strategy Team, Executive Leadership, Business Development

---

```markdown
# Competitive Landscape Report
## {{CLIENT_NAME}} vs. {{COMPETITOR_COUNT}} Competitors

**Prepared by:** Humanbrand AI  
**Analysis Date:** {{DATE}}  
**Entities Analyzed:** {{CLIENT}}, {{COMPETITOR_LIST}}

---

## Executive Summary

{{3-4 paragraphs covering:
- The competitive positioning landscape
- Where the client stands vs. competitors
- The single biggest competitive threat
- The single biggest competitive opportunity

Example:
"The automotive Tier-1 supplier competitive landscape reveals a category converging around similar positioning claims. Nine of ten analyzed competitors claim 'innovation leadership,' eight claim 'global presence,' and all ten emphasize sustainability commitment. In this environment, genuine differentiation requires proof, not claims.

Magna occupies a distinctive position as the only true 'systems integrator with complete vehicle capability'—a claim competitors cannot credibly make. However, this differentiation is undersold: complete vehicle messaging represents only 12% of content, while generic 'partnership' language (indistinguishable from competitors) dominates.

The primary competitive threat comes from Aptiv, which has successfully claimed the 'software-defined vehicle' narrative with 45% share of voice on this topic—nearly 4x Magna's 11.7%. As vehicles become software platforms, this positioning could prove more relevant than manufacturing capability.

The clearest opportunity: regional manufacturing agility. In a tariff-sensitive environment, Magna's multi-region production capability is a genuine differentiator that zero competitors are actively messaging. First-mover advantage is available."}}

---

## I. Positioning Landscape

### Positioning Map

{{Description of positioning dimensions and where entities fall}}

| Entity | Innovation ↔ Reliability | Specialist ↔ Integrator | Positioning Type |
|--------|--------------------------|-------------------------|------------------|
| {{Client}} | {{X}}/10 | {{X}}/10 | {{Type}} |
| {{Competitor 1}} | {{X}}/10 | {{X}}/10 | {{Type}} |
| {{Competitor 2}} | {{X}}/10 | {{X}}/10 | {{Type}} |

### Positioning Clusters

**Cluster 1: {{NAME}}**  
Entities: {{List}}  
Shared Positioning: {{Description}}  
Differentiation Within Cluster: {{Description}}

**Cluster 2: {{NAME}}**  
{{Same structure}}

### Unoccupied Positioning Territories

| Territory | Description | Credibility Requirements | Client Fit |
|-----------|-------------|--------------------------|------------|
| {{Territory 1}} | {{Description}} | {{Requirements}} | {{High/Medium/Low}} |
| {{Territory 2}} | {{Description}} | {{Requirements}} | {{High/Medium/Low}} |

---

## II. Category Grammar

### What Everyone Says (Zero Differentiation Value)

| Claim | Prevalence | Example Phrasing | Recommendation |
|-------|------------|------------------|----------------|
| Innovation Leader | 9 of 10 | "pioneering," "leading innovation" | Avoid unless with unique proof |
| Global Presence | 10 of 10 | "worldwide," "global footprint" | Use only with regional specificity |
| Partner of Choice | 8 of 10 | "trusted partner," "strategic partner" | Show partnership, don't claim it |
| Sustainability Commitment | 10 of 10 | "committed to sustainability" | Differentiate with specific metrics |

### Emerging Category Narratives

| Narrative | Current Leaders | Prevalence | Trajectory | Client Position |
|-----------|-----------------|------------|------------|-----------------|
| {{Narrative 1}} | {{Leaders}} | {{X}} of 10 | {{↑/→/↓}} | {{Position}} |
| {{Narrative 2}} | {{Leaders}} | {{X}} of 10 | {{↑/→/↓}} | {{Position}} |

### Language to Avoid

{{List of overused category clichés with recommendations}}

---

## III. Topic Ownership

### Value Driver Landscape

| Driver | Leader | Leader SOV | Client Rank | Client SOV | Gap |
|--------|--------|------------|-------------|------------|-----|
| {{Electrification}} | {{Entity}} | {{X}}% | {{Rank}} | {{X}}% | {{X}}pp |
| {{ADAS/Autonomy}} | {{Entity}} | {{X}}% | {{Rank}} | {{X}}% | {{X}}pp |
| {{SDV}} | {{Entity}} | {{X}}% | {{Rank}} | {{X}}% | {{X}}pp |
| {{Sustainability}} | {{Entity}} | {{X}}% | {{Rank}} | {{X}}% | {{X}}pp |
| {{Lightweighting}} | {{Entity}} | {{X}}% | {{Rank}} | {{X}}% | {{X}}pp |

### Topic Ownership Assessment

**Topics Client Leads:**  
{{Description of owned topics}}

**Topics Client Must Contest:**  
{{Description of contested but critical topics}}

**Topics Available for Ownership:**  
{{Description of undercontested opportunities}}

---

## IV. Competitor Playbooks

### {{COMPETITOR 1 NAME}}

**Strategic Positioning:**  
> "{{One-sentence positioning synthesis}}"

**Archetype:** {{Primary}} / {{Secondary}}

**Content Strategy:**
- Primary Channel: {{Channel}}
- Signature Content: {{Description}}
- Posting Cadence: {{Frequency}}

**Narrative Strategy:**
- Hero: {{Who they champion}}
- Antagonist: {{What they fight}}
- Core Tension: {{Their dramatic conflict}}

**Strengths:**
- {{Strength 1}}
- {{Strength 2}}

**Vulnerabilities:**
- {{Vulnerability 1}}
- {{Vulnerability 2}}

**What to Steal:**  
{{Specific tactics worth emulating}}

**How to Beat:**  
{{Specific strategies to compete against this entity}}

**Threat Level:** {{High/Medium/Low}}  
**Primary Threat Areas:** {{List}}

---

### {{COMPETITOR 2 NAME}}

{{Same structure}}

---

## V. Strategic Opportunities

### Whitespace Analysis

| Opportunity | Type | Current Gap | Effort | Impact | Priority |
|-------------|------|-------------|--------|--------|----------|
| {{Opportunity 1}} | {{Topic/Position/Channel}} | {{Description}} | {{H/M/L}} | {{H/M/L}} | {{Score}}/100 |
| {{Opportunity 2}} | {{Type}} | {{Description}} | {{H/M/L}} | {{H/M/L}} | {{Score}}/100 |

### Priority Matrix

**High Impact, Low Effort (Do First):**
1. {{Opportunity}}
2. {{Opportunity}}

**High Impact, High Effort (Plan For):**
1. {{Opportunity}}
2. {{Opportunity}}

**Medium Priority:**
1. {{Opportunity}}

### 90-Day Focus Recommendation

1. **{{Top Priority}}**  
   Rationale: {{Why this first}}  
   Expected Outcome: {{What success looks like}}

2. **{{Second Priority}}**  
   Rationale: {{Why}}  
   Expected Outcome: {{Outcome}}

3. **{{Third Priority}}**  
   Rationale: {{Why}}  
   Expected Outcome: {{Outcome}}

---

## VI. Competitive Content Benchmarks

### Content Volume

| Entity | Website Pages | Social Posts/Week | Total Content Score |
|--------|---------------|-------------------|---------------------|
| {{Entities ranked}} | | | |

### Content Quality Indicators

| Entity | Proof Density | Theme Consistency | Voice Distinctiveness |
|--------|---------------|-------------------|----------------------|
| {{Entities}} | | | |

### Engagement Performance

| Entity | LinkedIn Engagement Rate | YouTube Views/Video | Content Effectiveness |
|--------|--------------------------|---------------------|----------------------|
| {{Entities}} | | | |

---

## VII. Strategic Implications

### Competitive Threats

1. **{{Threat}}:** {{Description and implications}}
2. **{{Threat}}:** {{Description}}

### Competitive Advantages

1. **{{Advantage}}:** {{Description and how to amplify}}
2. **{{Advantage}}:** {{Description}}

### Strategic Questions for Leadership

1. {{Question that requires strategic decision}}
2. {{Question}}
3. {{Question}}

---

## Methodology Note

**Entities Analyzed:** {{List}}  
**Data Sources:** Website content, social media ({{Channels}})  
**Analysis Period:** {{Date range}}  
**Limitations:** {{Any coverage gaps or data limitations}}

---
```

---

# Report 5: Voice of Market Report

**File:** `reports/{entity}_voice_of_market_report.md`  
**Agent:** RPT-05 Voice of Market Report Generator  
**Purpose:** What the audience actually thinks, asks, and wants  
**Audience:** Content Team, Product Marketing, Customer Experience

---

```markdown
# Voice of Market Report: {{ENTITY_NAME}}
## What Your Audience Actually Thinks

**Prepared by:** Humanbrand AI  
**Analysis Date:** {{DATE}}  
**Comments Analyzed:** {{TOTAL_COMMENTS}} across {{CHANNEL_COUNT}} channels

---

## Executive Summary

{{2-3 paragraphs covering:
- Overall audience sentiment
- Most common questions and what they reveal
- Key objections and proof gaps
- Primary content opportunity based on audience signals

Example:
"Analysis of 4,620 comments across LinkedIn, YouTube, and Instagram reveals an audience that respects Magna's technical capability but wants more specificity and human connection. The most common question pattern—'When/where will this be available?'—appears 89 times, indicating strong interest that current content doesn't satisfy with concrete timelines.

The audience's sustainability interest significantly exceeds content supply. Comments praising sustainability initiatives generate the highest positive sentiment, yet sustainability content represents only 13.7% of posts. This is a clear demand signal.

The most concerning pattern: comparative questions ('How does this compare to Bosch?') receive brand responses only 12% of the time. Silence on competitive comparison leaves audiences to draw their own conclusions—or seek answers from competitors."}}

---


## I. Audience Sentiment Analysis

{{Analyze audience emotional tone and sentiment polarity in the comment corpus. Highlight dominant emotions, polarity balance, and where sentiment spikes (topics, features, competitor comparisons).}}

### Overall Sentiment Summary

| Dimension | Result | Evidence |
|----------|--------|----------|
| Polarity distribution | {{% very_positive/positive/neutral/negative/very_negative}} | {{[e:ID]}} |
| Dominant emotional tones | {{Top 3 tones + intensity}} | {{[e:ID]}} |
| Subjectivity | {{Objective/Mixed/Subjective}} | {{[e:ID]}} |

### Sentiment by Theme / Intent

| Theme / Intent | Polarity | Emotional Tone | What it signals |
|----------------|----------|----------------|-----------------|
| {{Theme 1}} | {{...}} | {{...}} | {{...}} |
| {{Theme 2}} | {{...}} | {{...}} | {{...}} |

## II. Question Bank

### What Your Audience Asks

| Question Pattern | Frequency | Response Rate | Content Opportunity |
|------------------|-----------|---------------|---------------------|
| {{Pattern 1}} | {{X}} | {{X}}% | {{Opportunity}} |
| {{Pattern 2}} | {{X}} | {{X}}% | {{Opportunity}} |
| {{Pattern 3}} | {{X}} | {{X}}% | {{Opportunity}} |
| {{Pattern 4}} | {{X}} | {{X}}% | {{Opportunity}} |
| {{Pattern 5}} | {{X}} | {{X}}% | {{Opportunity}} |

### Deep Dive: Top Questions

**Question 1: "{{PATTERN}}"**  
Frequency: {{X}} occurrences  
Contexts: {{Where these questions appear}}  
Current Response: {{How brand responds, if at all}}

**What This Reveals:**  
{{Strategic interpretation. Example: "Audiences want concrete availability information before engaging further. This suggests we're generating interest but losing potential leads by not providing clear next steps."}}

**Content Recommendation:**  
{{Specific content type or approach that would address this}}

---

**Question 2: "{{PATTERN}}"**

{{Same structure}}

---

## III. Objection Bank

### Where Audiences Push Back

| Objection Pattern | Frequency | Sentiment | Proof Needed |
|-------------------|-----------|-----------|--------------|
| {{Pattern 1}} | {{X}} | {{Skeptical/Concerned/Hostile}} | {{What would counter}} |
| {{Pattern 2}} | {{X}} | {{Sentiment}} | {{Proof needed}} |
| {{Pattern 3}} | {{X}} | {{Sentiment}} | {{Proof needed}} |

### Deep Dive: Top Objections

**Objection 1: "{{PATTERN}}"**

Sample Comments:
- "{{Verbatim quote}}" — {{Channel}}, {{Date}}
- "{{Verbatim quote}}" — {{Channel}}, {{Date}}

**Why This Matters:**  
{{Strategic interpretation}}

**How to Address:**  
{{Content/proof strategy to counter this objection}}

---

## IV. Proof Demands

### What Audiences Explicitly Want Evidence Of

| Demand | Frequency | Current Proof Provided | Gap |
|--------|-----------|------------------------|-----|
| {{Demand 1}} | {{X}} | {{Assessment}} | {{Gap description}} |
| {{Demand 2}} | {{X}} | {{Assessment}} | {{Gap description}} |

**Proof Strategy Implications:**  
{{How to better substantiate claims based on what audiences actually ask for}}

---

## V. Misperception Hotspots

### Where Audience Understanding ≠ Reality

| Misperception | Frequency | Actual Reality | Content Cause |
|---------------|-----------|----------------|---------------|
| {{Misperception 1}} | {{X}} | {{Truth}} | {{Why this exists}} |
| {{Misperception 2}} | {{X}} | {{Truth}} | {{Why}} |

**Correction Strategy:**  
{{How to address misperceptions through content}}

---

## VI. Positive Signals

### What Resonates

| Signal | Frequency | Triggering Content | Amplification Opportunity |
|--------|-----------|-------------------|---------------------------|
| {{Signal 1}} | {{X}} | {{Content type}} | {{How to do more}} |
| {{Signal 2}} | {{X}} | {{Content type}} | {{Opportunity}} |
| {{Signal 3}} | {{X}} | {{Content type}} | {{Opportunity}} |

**What the Audience Loves:**  
{{Narrative description of positive patterns}}

---

## VII. Competitor Mentions

### How Competitors Come Up in Your Audience's Conversation

| Competitor | Mentions | Typical Context | Sentiment | Implication |
|------------|----------|-----------------|-----------|-------------|
| {{Competitor 1}} | {{X}} | {{How mentioned}} | {{+/-/neutral}} | {{Strategic implication}} |
| {{Competitor 2}} | {{X}} | {{Context}} | {{Sentiment}} | {{Implication}} |

---

## VIII. Brand Response Analysis

### How Well You're Engaging

| Metric | Value | Assessment |
|--------|-------|------------|
| Overall Response Rate | {{X}}% | {{Good/Needs Improvement}} |
| Avg. Response Time | {{X}} hours | {{Assessment}} |
| Response Quality | {{X}}% helpful, {{X}}% generic | {{Assessment}} |

### Response Gaps

{{Questions or topics where brand rarely responds}}

### Response Recommendations

1. {{Recommendation}}
2. {{Recommendation}}
3. {{Recommendation}}

---

## IX. Content Recommendations

### Based on Audience Signals

| Priority | Recommendation | Audience Signal | Expected Impact |
|----------|---------------|-----------------|-----------------|
| 1 | {{Recommendation}} | {{What triggered this}} | {{Impact}} |
| 2 | {{Recommendation}} | {{Signal}} | {{Impact}} |
| 3 | {{Recommendation}} | {{Signal}} | {{Impact}} |
| 4 | {{Recommendation}} | {{Signal}} | {{Impact}} |
| 5 | {{Recommendation}} | {{Signal}} | {{Impact}} |

---

## Methodology Note

**Comments Analyzed:** {{Total}} across {{Channels}}  
**Date Range:** {{Start}} to {{End}}  
**Languages:** {{Distribution}}  
**Sampling:** {{Approach—all comments or sample}}

---
```

---

# Report 6: Internal Consistency Report

**File:** `reports/{entity}_consistency_report.md`  
**Agent:** RPT-04 Consistency Report Generator  
**Purpose:** Cross-channel brand consistency assessment  
**Audience:** Brand Team, Channel Managers, Creative Directors

---

```markdown
# Internal Consistency Report: {{ENTITY_NAME}}
## Are You One Brand or Many?

**Prepared by:** Humanbrand AI  
**Analysis Date:** {{DATE}}  
**Channels Analyzed:** {{CHANNEL_LIST}}

---

## Executive Summary

**Overall Consistency Score:** {{SCORE}}/100

| Score Range | Interpretation |
|-------------|----------------|
| 90-100 | Exceptional—unified brand voice |
| 75-89 | Strong—minor variations |
| 60-74 | Moderate—noticeable gaps |
| Below 60 | Significant fragmentation |

{{2-3 paragraphs on:
- Overall consistency assessment
- Most consistent element
- Biggest gap
- Priority recommendations

Example:
"Magna presents as a moderately consistent brand (score: 72/100), with strong alignment on core positioning and color palette but meaningful divergence in tone and visual template systems across channels.

The strongest unifier is the 'complete vehicle solutions' messaging, which appears consistently across website, LinkedIn, and YouTube. The color palette (navy, gray, orange accent) is also well-maintained, appearing in 85%+ of visual content across all channels.

The most significant gap is Instagram, which has developed a visually distinct identity with warmer tones and more casual composition. While channel-appropriate adaptation is healthy, Instagram's visual system has drifted far enough that cross-channel followers may not immediately recognize the brand. Additionally, the 'people and culture' theme that dominates LinkedIn (28% of content) is virtually absent from the website, creating a perception disconnect between channels."}}

---

## I. Dimension Scores

| Dimension | Score | Assessment |
|-----------|-------|------------|
| Voice Consistency | {{X}}/100 | {{Assessment}} |
| Theme Consistency | {{X}}/100 | {{Assessment}} |
| Visual Consistency | {{X}}/100 | {{Assessment}} |
| Messaging Consistency | {{X}}/100 | {{Assessment}} |
| Proof Consistency | {{X}}/100 | {{Assessment}} |

---

## II. Voice Consistency

**Score:** {{X}}/100

### Voice by Channel

| Channel | Voice Attributes | Tonal Position | Assessment |
|---------|-----------------|----------------|------------|
| Website | {{Attributes}} | {{Formal/Technical/etc.}} | — |
| LinkedIn | {{Attributes}} | {{Position}} | {{vs. Website}} |
| YouTube | {{Attributes}} | {{Position}} | {{vs. Website}} |
| Instagram | {{Attributes}} | {{Position}} | {{vs. Website}} |

### Voice Alignment Analysis

**Consistent Elements:**  
{{What remains constant across channels}}

**Divergent Elements:**  
{{Where voice differs—and whether this is appropriate channel adaptation or problematic inconsistency}}

---

## III. Theme Consistency

**Score:** {{X}}/100

### Theme Distribution by Channel

| Theme | Website | LinkedIn | YouTube | Instagram | Gap |
|-------|---------|----------|---------|-----------|-----|
| {{Theme 1}} | {{X}}% | {{X}}% | {{X}}% | {{X}}% | {{Max variance}} |
| {{Theme 2}} | {{X}}% | {{X}}% | {{X}}% | {{X}}% | {{Variance}} |
| {{Theme 3}} | {{X}}% | {{X}}% | {{X}}% | {{X}}% | {{Variance}} |

### Theme Alignment Analysis

**Present Everywhere:**  
{{Themes that unify the brand across channels}}

**Missing on Some Channels:**  
{{Themes with uneven coverage—and implications}}

---

## IV. Visual Consistency

**Score:** {{X}}/100

### Visual Elements by Channel

| Element | Website | LinkedIn | YouTube | Instagram | Consistency |
|---------|---------|----------|---------|-----------|-------------|
| Color Palette | {{Description}} | {{Description}} | {{Description}} | {{Description}} | {{H/M/L}} |
| Photography Style | {{Description}} | {{Description}} | {{Description}} | {{Description}} | {{H/M/L}} |
| Template System | {{Description}} | {{Description}} | {{Description}} | {{Description}} | {{H/M/L}} |
| Logo Usage | {{Description}} | {{Description}} | {{Description}} | {{Description}} | {{H/M/L}} |

### Visual Alignment Analysis

**Strong Visual Unifiers:**  
{{Elements that create recognition across channels}}

**Visual Fragmentation Risks:**  
{{Where visual identity diverges problematically}}

---

## V. Channel Pair Analysis

### Website ↔ LinkedIn

**Consistency Score:** {{X}}/100

**Aligned:**
- {{Element}}
- {{Element}}

**Divergent:**
- {{Element with description}}
- {{Element}}

---

### Website ↔ YouTube

{{Same structure}}

---

### Website ↔ Instagram

{{Same structure}}

---

### LinkedIn ↔ Instagram

{{Same structure}}

---

## VI. Consistency Gaps

### Gap 1: {{GAP_NAME}}

**Severity:** {{Critical/Significant/Moderate/Minor}}  
**Channels Affected:** {{List}}

**The Gap:**  
{{Description}}

**Impact:**  
{{How this affects brand perception}}

**Recommendation:**  
{{How to close the gap}}

**Effort:** {{High/Medium/Low}}

---

### Gap 2: {{GAP_NAME}}

{{Same structure}}

---

## VII. Strongest Unifiers

{{List of elements that successfully create brand consistency}}

1. {{Unifier 1}} — {{How it works}}
2. {{Unifier 2}} — {{How it works}}
3. {{Unifier 3}} — {{How it works}}

---

## VIII. Fragmentation Risks

{{List of areas where brand is at risk of appearing as multiple brands}}

1. {{Risk 1}} — {{Impact if not addressed}}
2. {{Risk 2}} — {{Impact}}
3. {{Risk 3}} — {{Impact}}

---

## IX. Recommendations

### Priority 1: {{RECOMMENDATION}}

**Gap Addressed:** {{Which gap}}  
**Effort:** {{High/Medium/Low}}  
**Expected Consistency Lift:** +{{X}} points  
**Timeline:** {{Estimate}}

### Priority 2: {{RECOMMENDATION}}

{{Same structure}}

### Priority 3: {{RECOMMENDATION}}

{{Same structure}}

---

## Methodology Note

**Channels Analyzed:** {{List}}  
**Content Analyzed:** {{Description of what was compared}}  
**Analysis Approach:** {{Methodology}}

---
```

---

# Report 7: Visual Competitive Analysis Report

**File:** `reports/visual_competitive_report.md`  
**Agent:** RPT-07 Visual Competitive Report Generator  
**Purpose:** Cross-competitor visual identity comparison  
**Audience:** Creative Team, Brand Strategists

---

```markdown
# Visual Competitive Analysis
## {{CLIENT_NAME}} vs. {{COMPETITOR_COUNT}} Competitors

**Prepared by:** Humanbrand AI  
**Analysis Date:** {{DATE}}  
**Entities Analyzed:** {{ENTITY_LIST}}  
**Images Analyzed:** {{TOTAL_IMAGE_COUNT}}

---

## Executive Summary

{{2-3 paragraphs capturing:
- The category's visual conventions (what everyone does)
- Where the client's visual identity stands relative to competitors
- The biggest visual differentiation opportunity
- The biggest visual threat from competitors

This should be strategic: not just "they use blue" but "the category has converged on cool blues and clean aesthetics, making visual differentiation nearly impossible without a bold departure from convention."}}

---

## I. Category Visual Grammar

Understanding the visual "rules" of the category reveals both constraints and opportunities.

### Dominant Conventions

These visual patterns are used by most competitors and have become category expectations:

| Convention | Prevalence | Signal | Differentiation Value |
|------------|------------|--------|----------------------|
| {{CONVENTION_1}} | {{X}} of {{Y}} | {{WHAT_IT_COMMUNICATES}} | {{NONE/LOW/MEDIUM}} |
| {{CONVENTION_2}} | {{X}} of {{Y}} | {{WHAT_IT_COMMUNICATES}} | {{NONE/LOW/MEDIUM}} |
| {{CONVENTION_3}} | {{X}} of {{Y}} | {{WHAT_IT_COMMUNICATES}} | {{NONE/LOW/MEDIUM}} |
| {{CONVENTION_4}} | {{X}} of {{Y}} | {{WHAT_IT_COMMUNICATES}} | {{NONE/LOW/MEDIUM}} |

{{1-2 paragraphs analyzing what these conventions reveal about the category. Why have these become standard? What do they signal about audience expectations?}}

### Visual Clichés to Avoid

These elements are so overused they've become meaningless:

| Cliché | Usage | Why It Fails | Alternative Approach |
|--------|-------|--------------|---------------------|
| {{CLICHE_1}} | {{FREQUENCY}} | {{ASSESSMENT}} | {{ALTERNATIVE}} |
| {{CLICHE_2}} | {{FREQUENCY}} | {{ASSESSMENT}} | {{ALTERNATIVE}} |
| {{CLICHE_3}} | {{FREQUENCY}} | {{ASSESSMENT}} | {{ALTERNATIVE}} |

### Underexplored Visual Territories

These visual approaches are rarely used in the category—potential whitespace:

| Territory | Current Usage | Why It's Underused | Opportunity Assessment |
|-----------|---------------|-------------------|----------------------|
| {{TERRITORY_1}} | {{USAGE}} | {{REASON}} | {{OPPORTUNITY}} |
| {{TERRITORY_2}} | {{USAGE}} | {{REASON}} | {{OPPORTUNITY}} |
| {{TERRITORY_3}} | {{USAGE}} | {{REASON}} | {{OPPORTUNITY}} |

---

## II. Color Landscape

### Category Color Map

| Entity | Primary | Secondary | Accent | Temperature | Mood |
|--------|---------|-----------|--------|-------------|------|
| {{CLIENT}} | {{COLOR}} ({{HEX}}) | {{COLOR}} | {{COLOR}} | {{WARM/COOL}} | {{MOOD}} |
| {{COMP_1}} | {{COLOR}} ({{HEX}}) | {{COLOR}} | {{COLOR}} | {{WARM/COOL}} | {{MOOD}} |
| {{COMP_2}} | {{COLOR}} ({{HEX}}) | {{COLOR}} | {{COLOR}} | {{WARM/COOL}} | {{MOOD}} |
| {{COMP_3}} | {{COLOR}} ({{HEX}}) | {{COLOR}} | {{COLOR}} | {{WARM/COOL}} | {{MOOD}} |
| {{COMP_4}} | {{COLOR}} ({{HEX}}) | {{COLOR}} | {{COLOR}} | {{WARM/COOL}} | {{MOOD}} |

### Color Analysis

**Category Color Convergence:**
{{Analysis of how similar the color palettes are. Is the category visually homogeneous? Do certain colors "own" certain meanings in this space?}}

**Client Color Position:**
{{Where does the client's palette sit relative to competitors? Is it distinctive or interchangeable?}}

**Color Whitespace:**
{{What color territories are available? What would it take to own them?}}

**Competitive Color Threats:**
{{Are any competitors making bold color moves that could redefine category expectations?}}

---

## III. Photography Style Comparison

### Style Distribution

| Entity | Dominant Style | Secondary Style | People Focus | Stock Reliance | Quality |
|--------|---------------|-----------------|--------------|----------------|---------|
| {{CLIENT}} | {{STYLE}} | {{STYLE}} | {{%}} | {{%}} | {{SCORE}} |
| {{COMP_1}} | {{STYLE}} | {{STYLE}} | {{%}} | {{%}} | {{SCORE}} |
| {{COMP_2}} | {{STYLE}} | {{STYLE}} | {{%}} | {{%}} | {{SCORE}} |
| {{COMP_3}} | {{STYLE}} | {{STYLE}} | {{%}} | {{%}} | {{SCORE}} |

### Photography Analysis

**Category Photography Norms:**
{{What photography style has become expected in this category? Is it industrial? Corporate? Lifestyle?}}

**Differentiation Through Photography:**
{{Who stands out photographically? What are they doing differently?}}

**Client Photography Assessment:**
{{How does client's photography compare? What's distinctive? What's generic?}}

**Photography Opportunity:**
{{What photography approach could differentiate the client?}}

---

## IV. Subject Matter Comparison

### What Everyone Shows

| Subject | Client | Comp 1 | Comp 2 | Comp 3 | Category Avg |
|---------|--------|--------|--------|--------|--------------|
| People | {{%}} | {{%}} | {{%}} | {{%}} | {{%}} |
| Products | {{%}} | {{%}} | {{%}} | {{%}} | {{%}} |
| Facilities | {{%}} | {{%}} | {{%}} | {{%}} | {{%}} |
| Technology/Abstract | {{%}} | {{%}} | {{%}} | {{%}} | {{%}} |
| Customers/Use Cases | {{%}} | {{%}} | {{%}} | {{%}} | {{%}} |

### Subject Matter Analysis

**Category Subject Norms:**
{{What does the category typically show? Is it product-heavy? People-heavy?}}

**People Representation Comparison:**
| Entity | Gender Balance | Diversity | Roles Shown | Human Connection |
|--------|---------------|-----------|-------------|------------------|
| {{CLIENT}} | {{BALANCE}} | {{LEVEL}} | {{ROLES}} | {{SCORE}} |
| {{COMP_1}} | {{BALANCE}} | {{LEVEL}} | {{ROLES}} | {{SCORE}} |

**Client Subject Matter Position:**
{{How does client's subject mix compare? What's overrepresented? Underrepresented?}}

**Subject Matter Opportunity:**
{{What subject matter could differentiate the client?}}

---

## V. Distinctiveness Scorecard

### Overall Visual Distinctiveness

| Entity | Distinctiveness Score | Key Distinctive Elements | Generic Elements |
|--------|----------------------|-------------------------|------------------|
| {{CLIENT}} | {{SCORE}}/100 | {{ELEMENTS}} | {{ELEMENTS}} |
| {{COMP_1}} | {{SCORE}}/100 | {{ELEMENTS}} | {{ELEMENTS}} |
| {{COMP_2}} | {{SCORE}}/100 | {{ELEMENTS}} | {{ELEMENTS}} |
| {{COMP_3}} | {{SCORE}}/100 | {{ELEMENTS}} | {{ELEMENTS}} |

### Distinctive Asset Inventory

**Client's Potentially Ownable Assets:**
| Asset | Description | Current Usage | Ownable? | Recommendation |
|-------|-------------|---------------|----------|----------------|
| {{ASSET_1}} | {{DESC}} | {{USAGE}} | {{YES/PARTIAL/NO}} | {{REC}} |
| {{ASSET_2}} | {{DESC}} | {{USAGE}} | {{YES/PARTIAL/NO}} | {{REC}} |

**Competitor Distinctive Assets to Watch:**
| Competitor | Asset | Threat Level | Defensive Action |
|------------|-------|--------------|-----------------|
| {{COMP}} | {{ASSET}} | {{LEVEL}} | {{ACTION}} |

---

## VI. Competitive Visual Playbooks

### {{COMPETITOR_1}} Visual Strategy

**Visual Signature:**
{{Description of their distinctive visual approach}}

**Color Strategy:** {{DESCRIPTION}}
**Photography Approach:** {{DESCRIPTION}}
**Subject Focus:** {{DESCRIPTION}}

**Visual Strengths:**
- {{STRENGTH_1}}
- {{STRENGTH_2}}

**Visual Weaknesses:**
- {{WEAKNESS_1}}
- {{WEAKNESS_2}}

**What to Steal:** {{SPECIFIC_TACTIC}}

**How to Beat Visually:** {{STRATEGY}}

---

### {{COMPETITOR_2}} Visual Strategy

{{Same structure}}

---

### {{COMPETITOR_3}} Visual Strategy

{{Same structure}}

---

## VII. Visual Whitespace Opportunities

### Available Visual Territories

| Territory | Description | Fit for Client | Implementation | Priority |
|-----------|-------------|----------------|----------------|----------|
| {{TERRITORY_1}} | {{DESC}} | {{HIGH/MED/LOW}} | {{HOW}} | {{1-5}} |
| {{TERRITORY_2}} | {{DESC}} | {{HIGH/MED/LOW}} | {{HOW}} | {{1-5}} |
| {{TERRITORY_3}} | {{DESC}} | {{HIGH/MED/LOW}} | {{HOW}} | {{1-5}} |

### Priority Opportunity: {{TERRITORY_NAME}}

**The Opportunity:**
{{Detailed description of the visual territory and why it's available}}

**Why It Fits the Client:**
{{How this aligns with brand positioning and capabilities}}

**Implementation Path:**
{{Specific steps to claim this territory}}

**Risk if Not Pursued:**
{{What happens if a competitor claims it first?}}

---

## VIII. Recommendations

### Visual Differentiation Strategy

{{High-level strategic recommendation for visual differentiation. This should be a cohesive vision, not a list of tactics.}}

### Specific Actions

**Priority 1: {{ACTION}}**
- Impact: {{DESCRIPTION}}
- Effort: {{HIGH/MEDIUM/LOW}}
- Timeline: {{ESTIMATE}}

**Priority 2: {{ACTION}}**
- Impact: {{DESCRIPTION}}
- Effort: {{HIGH/MEDIUM/LOW}}
- Timeline: {{ESTIMATE}}

**Priority 3: {{ACTION}}**
- Impact: {{DESCRIPTION}}
- Effort: {{HIGH/MEDIUM/LOW}}
- Timeline: {{ESTIMATE}}

### Visual "Brand Would Never" Guidelines

Based on competitive analysis, the client should avoid:

1. **{{WOULD_NEVER_1}}** — {{WHY}} ({{COMPETITORS_WHO_DO_THIS}})
2. **{{WOULD_NEVER_2}}** — {{WHY}}
3. **{{WOULD_NEVER_3}}** — {{WHY}}

---

## IX. Key Insights

{{5-7 most important visual competitive insights, written as strategic statements not bullet fragments}}

1. {{INSIGHT_1}}

2. {{INSIGHT_2}}

3. {{INSIGHT_3}}

4. {{INSIGHT_4}}

5. {{INSIGHT_5}}

---

## Methodology Note

**Entities Analyzed:** {{LIST}}  
**Total Images Analyzed:** {{COUNT}}  
**Analysis Dimensions:** Color, photography style, subject matter, templates, distinctive assets  
**Limitations:** {{Any caveats about the analysis}}

---
```

---

# Report Generation Instructions

## For All Reports

1. **Pull from Machine Layer** — Reports synthesize from JSON outputs, not raw data
2. **Cite Evidence Sparingly** — Include evidence IDs parenthetically but don't overwhelm with data
3. **Lead with "So What"** — Every finding should have strategic implication
4. **Surface Tensions** — Contradictions are insights, not problems to hide
5. **Maintain Human Voice** — Write as a strategist presenting to executives
6. **Include Limitations** — Be honest about what the analysis can and cannot claim

## Quality Checklist

Before finalizing any report:

- [ ] Executive Summary is 2-3 paragraphs max
- [ ] No bullet points in narrative sections
- [ ] All confidence scores included where applicable
- [ ] Tensions section is substantive (not empty)
- [ ] Recommendations are specific and actionable
- [ ] Methodology note explains what was analyzed
- [ ] Evidence IDs are valid references

---

# End of Report Templates Document


---

