This single document contains everything engineering and product needs to build **Brand OS vNext Phases 0–2 (Outside-In Audit & Strategic Intelligence)**, including agents, prompts, schemas, compilation logic, quality gates, human-layer report templates, the evidence system, and the in-platform UI presentation layer.

### Scope Note (Strict)

Phases 0–2 are **owned-channel only**:

- Website
- In-scope social channels
- Comments

Earned media is **out of scope** and is **not required by any schema**.

## 2. User Flows & What the User Sees (Phases 0–2)

This section describes the end-to-end product experience: what a user does, what Brand OS shows at each step, and how outputs map to artifacts.

---

### 2.1 Roles & Permissions (recommended)

- **Workspace Admin**: creates engagements, manages access, exports
- **Analyst / Strategist**: runs analyses, reviews evidence, generates exports
- **Client Viewer**: read-only access to reports + evidence citations (optional)

---

### 2.2 Flow A — Create an Engagement (Setup Wizard)

**Goal:** Define scope, competitive frame, and analysis parameters so data collection and downstream agents run deterministically.

**A1 — Engagement Basics**

- Engagement name
- Client name
- Industry (optional)
- Analysis defaults

**A2 — Competitive Frame**

- Competitors (name + website domain)
- Optional social handles (if known)

**A3 — Channels & Lookback**

- Channels in scope: LinkedIn, YouTube, Instagram, X, Facebook, TikTok
- Social lookback days (default: 365)
- Max posts per channel (default: 200, minimum: 50)
- Comments collection (recommended: ON)

---

### 2.3 Flow B — Data Collection → Corpus Review (Phase 0 + Gate 0)

**Users see:**

- Collection progress by entity × channel
- Corpus manifest view with pass / warn / fail
- Coverage gaps with severity and mitigation suggestions

**Primary actions:**

- **PASS**: proceed
- **WARN**: proceed with caveat banners
- **FAIL**: revise scope, extend lookback, or recollect

---

### 2.4 Flow C — Extraction & Compilation (Phase 1 + Gates 1–2)

**Users see:**

- Pipeline timeline (extraction → compilation → validation)
- Gate 1 failures with actionable details (e.g., missing engagement, invalid sentiment)
- Gate 2 integrity checks (counts, sums, distributions)

---

### 2.5 Flow D — Synthesis & Report Generation (Phase 2 + Gates 3–4)

**Users see:**

- Confidence and evidence density summaries
- Reports rendered as interactive views with clickable citations

**Citation click opens an Evidence Panel showing:**

- Evidence ID
- Source URL / permalink
- Capture timestamp
- Snippet / preview

**Actions:**

- View full source
- Open in context
- Download evidence

---

### 2.6 Flow E — Comparative Exploration

Users can compare client vs competitors across:

- Positioning and theme share-of-voice
- Visual identity (palette, style, subject distribution)
- Voice of Market (top questions / objections + sentiment slices)

---

### 2.7 Flow F — Export & Handoff

**Exports:**

- PDF of any report (single report or full pack)
- Machine artifact export (ZIP of JSON + gates)
- BAM input pack (`bam_input_pack.json`)

---

### 2.8 Exception UX (must-have)

- Private or inaccessible channels: partial-data badges and documented impacts
- Insufficient corpus: Gate 0 FAIL blocks synthesis with remediation steps
- Low-confidence synthesis: confidence badges and “thin evidence” notes
- Schema validation: actionable errors with failing JSON paths

---

## Implementation Checklist

### Phase 0

- Generate `evidence_ledger.json` + `corpus_manifest.json` (SA‑00)

### Phase 1 (Map)

- Run OI‑01 on each webpage → `url_extraction_*.json`
- Run OI‑02 on each image → `image_extraction_*.json`
- Run OI‑03 on each social post → `post_extraction_*.json`

### Phase 1 (Reduce / COMP)

- Precompute aggregates in Python (cadence, distributions, etc.)
- Run:
  - COMP‑01 → `website_verbal_bedrock.json`
  - COMP‑02 → `website_visual_bedrock.json`
  - COMP‑03 → `{entity}_{channel}_bedrock.json`
  - COMP‑04 → `{entity}_{channel}_visual_bedrock.json`

### Phase 2 (Entity)

- OI‑10 → `fact_base.json`
- OI‑11 → brand_platform / brand_archetype / brand_narrative / brand_voice
- OI‑12 → content_strategy
- OI‑14 → internal_consistency
- OI‑15 → voice_of_market
- OI‑16 → visual_identity

### Phase 2 (Cross-Entity)

- OI‑13 → positioning_landscape / category_grammar / topic_ownership / whitespace_analysis / competitor_playbooks
- OI‑17 → visual_competitive_analysis

### Reports

- RPT‑01..07 using `Brand_OS_Report_Templates_v2.md`

### Bridge

- BRIDGE‑01 → `bam_input_pack.json`

### QA

- Produce `gate_outputs.json` using `Brand_OS_Quality_Gates.md` checks.

---

## Files included (14 total)

1. `./Brand_OS_Master_Deliverable_Specification_v1.md`
2. `./Brand_OS_Quality_Gates.md`
3. `./Brand_OS_Agent_Inventory.md`
4. `./Brand_OS_Agent_Prompts_v2.md`
5. `./Brand_OS_Channel_Adaptations.md`
6. `./Brand_OS_Compilation_Logic.md`
7. `./Brand_OS_Continuation_Brief.md`
8. `./Brand_OS_Evidence_System.md`
9. `./Brand_OS_Report_Templates_v2.md`
10. `./Brand_OS_Schemas_v2.md`
11. `./Brand_OS_Sentiment_Extraction.md`
