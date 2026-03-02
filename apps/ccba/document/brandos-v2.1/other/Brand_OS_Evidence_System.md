# Brand OS vNext: Evidence System
## Evidence ID Conventions, Citation Rules, and Traceability

**Version:** 2.0  
**Date:** December 22, 2025  
**Status:** Engineering Handoff Document

---

# Overview

The Evidence System ensures every claim in Brand OS outputs can be traced to its source. This is the foundation of the "amnesia protocol" — without prior knowledge, all conclusions must be grounded in corpus evidence.

## Core Principle

> **No claim without evidence. No evidence without ID. No ID without source.**

---

# Evidence ID Format

## ID Structure

```
[TYPE][SEQUENCE]

TYPE:     2-letter prefix indicating evidence type
SEQUENCE: 5-digit zero-padded number
```

## Evidence Types

| Prefix | Type | Source | Example |
|--------|------|--------|---------|
| `E` | Text Evidence | Webpage, social post text | E00001 |
| `VE` | Visual Evidence | Image file | VE00001 |
| `EC` | Comment Evidence | Social comment/reply | EC00001 |

## ID Ranges

To enable parallel processing without collisions:

| Entity Position | E Range | VE Range | EC Range |
|-----------------|---------|----------|----------|
| Client | E00001-E19999 | VE00001-VE09999 | EC00001-EC19999 |
| Competitor 1 | E20000-E39999 | VE10000-VE19999 | EC20000-EC39999 |
| Competitor 2 | E40000-E59999 | VE20000-VE29999 | EC40000-EC59999 |
| Competitor 3 | E60000-E79999 | VE30000-VE39999 | EC60000-EC79999 |
| Competitor 4 | E80000-E99999 | VE40000-VE49999 | EC80000-EC99999 |

## Secondary IDs

For internal tracking (not exposed in reports):

| Prefix | Type | Example |
|--------|------|---------|
| `URL-` | Webpage identifier | URL-00150 |
| `IMG-` | Image identifier | IMG-00234 |
| `POST-` | Social post identifier | POST-00089 |
| `CL-` | Claim identifier | CL-00012 |
| `F-` | Fact identifier | F-00045 |
| `T` | Tension identifier | T001 |

---

# Evidence Ledger Structure

## Master Ledger Entry

```json
{
  "evidence_id": "E00145",
  "source_type": "webpage",
  "source_channel": "website",
  "source_entity": "Client",
  "source_url": "https://client.com/about",
  "source_timestamp": null,
  "content_type": "text",
  "excerpt": "We partner with the world's leading automakers to build the mobility solutions of tomorrow.",
  "full_content_uri": "s3://brandos/evidence/E00145.json",
  "extraction_date": "2024-12-22T14:30:00Z",
  "metadata": {
    "page_type": "about",
    "word_count": 1245,
    "url_id": "URL-00023"
  }
}
```

## Visual Evidence Entry

```json
{
  "evidence_id": "VE00089",
  "source_type": "image",
  "source_channel": "website",
  "source_entity": "Client",
  "source_url": "https://client.com/about",
  "source_timestamp": null,
  "content_type": "image",
  "excerpt": "Hero image: Manufacturing facility with workers and robotic equipment",
  "full_content_uri": "s3://brandos/images/VE00089.jpg",
  "extraction_date": "2024-12-22T14:30:00Z",
  "metadata": {
    "image_id": "IMG-00089",
    "dimensions": {"width": 1920, "height": 1080},
    "file_size_kb": 245,
    "alt_text": "Advanced manufacturing facility"
  }
}
```

## Comment Evidence Entry

```json
{
  "evidence_id": "EC00234",
  "source_type": "comment",
  "source_channel": "linkedin",
  "source_entity": "Client",
  "source_url": "https://linkedin.com/posts/client_12345",
  "source_timestamp": "2024-06-15T14:22:00Z",
  "content_type": "text",
  "excerpt": "How does this compare to Competitor1's solution?",
  "full_content_uri": "s3://brandos/evidence/EC00234.json",
  "extraction_date": "2024-12-22T14:30:00Z",
  "metadata": {
    "post_id": "POST-00156",
    "comment_author": "[anonymized]",
    "is_reply": false,
    "engagement": {"likes": 3}
  }
}
```

---

# Citation Rules

## In Machine Layer (JSON)

Every claim, fact, or synthesized element must include `evidence_ids`:

```json
{
  "mission": {
    "synthesized": "We partner with automakers to build mobility solutions",
    "confidence": 0.85,
    "evidence_ids": ["E00145", "E00267", "E00892"],
    "supporting_evidence": [
      {
        "quote": "We partner with the world's leading automakers...",
        "source": "About page",
        "evidence_id": "E00145"
      }
    ]
  }
}
```

## In Human Layer (Reports)

Citations appear parenthetically after claims:

```markdown
The brand positions itself as a global partner in mobility innovation, 
emphasizing long-term OEM relationships over transactional supplier 
dynamics (E00145, E00267, E00892).
```

### Citation Density Guidelines

| Content Type | Target Density |
|--------------|----------------|
| Executive Summary | 1-2 citations per paragraph |
| Analysis Sections | 1 citation per major claim |
| Evidence-Heavy Sections | 1 citation per sentence if needed |
| Recommendations | Citation for each supporting finding |

### When NOT to Cite

- General observations synthesized from many sources (use "across the corpus")
- Methodology descriptions
- Interpretive framing (save citations for the underlying data)

---

# Evidence Validation

## ID Validation Rules

```python
def validate_evidence_id(eid):
    """Validate evidence ID format."""
    import re
    
    patterns = {
        'text': r'^E[0-9]{5}$',
        'visual': r'^VE[0-9]{5}$',
        'comment': r'^EC[0-9]{5}$'
    }
    
    for etype, pattern in patterns.items():
        if re.match(pattern, eid):
            return True, etype
    
    return False, None
```

## Orphan Detection

Before finalizing any output, check for orphan references:

```python
def find_orphan_references(output, ledger):
    """Find evidence IDs referenced but not in ledger."""
    referenced = extract_all_evidence_ids(output)
    ledger_ids = set(e['evidence_id'] for e in ledger['evidence'])
    
    orphans = referenced - ledger_ids
    
    if orphans:
        raise ValidationError(f"Orphan evidence IDs: {orphans}")
    
    return True
```

## Unused Evidence Report

Track evidence that was collected but never cited:

```python
def unused_evidence_report(ledger, all_outputs):
    """Report evidence collected but never referenced."""
    all_referenced = set()
    for output in all_outputs:
        all_referenced.update(extract_all_evidence_ids(output))
    
    ledger_ids = set(e['evidence_id'] for e in ledger['evidence'])
    unused = ledger_ids - all_referenced
    
    return {
        "total_evidence": len(ledger_ids),
        "referenced": len(all_referenced),
        "unused": len(unused),
        "unused_ids": list(unused)[:100]  # First 100
    }
```

---

# Evidence Chain Traceability

## From Report to Source

```
Report Claim
    ↓ (citation)
Evidence ID (E00145)
    ↓ (ledger lookup)
Evidence Ledger Entry
    ↓ (full_content_uri)
Full Source Content
    ↓ (source_url)
Original Webpage/Post
```

## Implementation

```python
def trace_evidence(evidence_id, ledger):
    """Return full trace for an evidence ID."""
    entry = ledger.get(evidence_id)
    if not entry:
        return None
    
    return {
        "evidence_id": evidence_id,
        "excerpt": entry["excerpt"],
        "source_url": entry["source_url"],
        "source_channel": entry["source_channel"],
        "source_entity": entry["source_entity"],
        "full_content_available": entry["full_content_uri"] is not None,
        "extraction_date": entry["extraction_date"]
    }
```

---

# Evidence Quality Scoring

## Source Quality Weights

| Source Type | Weight | Rationale |
|-------------|--------|-----------|
| About/Company page | 1.0 | Official positioning |
| Product/Solution page | 0.9 | Core offerings |
| News/Press release | 0.8 | Official announcements |
| Blog post | 0.7 | Thought leadership |
| Social post | 0.6 | Real-time but informal |
| Comment | 0.4 | Audience voice |

## Evidence Strength Calculation

```python
def calculate_evidence_strength(evidence_ids, ledger):
    """Calculate weighted evidence strength."""
    if not evidence_ids:
        return 0.0
    
    weights = {
        "about": 1.0, "company": 1.0,
        "product": 0.9, "solution": 0.9,
        "news": 0.8, "press": 0.8,
        "blog": 0.7,
        "social_post": 0.6,
        "comment": 0.4
    }
    
    total_weight = 0
    for eid in evidence_ids:
        entry = ledger.get(eid)
        if entry:
            page_type = entry.get("metadata", {}).get("page_type", "other")
            source_type = entry.get("source_type", "webpage")
            
            if source_type == "comment":
                weight = 0.4
            elif source_type == "image":
                weight = 0.7
            else:
                weight = weights.get(page_type, 0.5)
            
            total_weight += weight
    
    # Normalize: more evidence = higher score, with diminishing returns
    count_factor = min(len(evidence_ids) / 5, 1.0)  # Max at 5 sources
    avg_weight = total_weight / len(evidence_ids)
    
    return round(avg_weight * (0.5 + 0.5 * count_factor), 2)
```

---

# Evidence Storage

## File Structure

```
s3://brandos-evidence/
├── {run_id}/
│   ├── ledger/
│   │   └── evidence_ledger.json
│   ├── text/
│   │   ├── E00001.json
│   │   ├── E00002.json
│   │   └── ...
│   ├── images/
│   │   ├── VE00001.jpg
│   │   ├── VE00002.png
│   │   └── ...
│   └── comments/
│       ├── EC00001.json
│       └── ...
```

## Retention Policy

| Data Type | Retention | Rationale |
|-----------|-----------|-----------|
| Evidence Ledger | 2 years | Audit trail |
| Full Text Content | 1 year | Re-analysis capability |
| Images | 6 months | Storage cost |
| Comments | 1 year | Audience insights |

---

# Evidence in UI

## Evidence Panel

When user clicks citation:

```
┌─────────────────────────────────────────────┐
│ EVIDENCE: E00145                    [Close] │
├─────────────────────────────────────────────┤
│ Source: Client Website - About Page         │
│ URL: https://client.com/about               │
│ Captured: December 22, 2024                 │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ "We partner with the world's leading    │ │
│ │ automakers to build the mobility        │ │
│ │ solutions of tomorrow. For over 60      │ │
│ │ years, we've been at the forefront..."  │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ [View Full Page] [View in Context]          │
└─────────────────────────────────────────────┘
```

## Evidence Strength Indicator

| Strength | Icon | Meaning |
|----------|------|---------|
| 0.80+ | ███████████ | Strong multi-source evidence |
| 0.60-0.79 | ████████░░░ | Good evidence |
| 0.40-0.59 | █████░░░░░░ | Limited evidence |
| <0.40 | ██░░░░░░░░░ | Weak evidence |

---

# Privacy & Anonymization

## Comment Anonymization

All comment authors are anonymized:

```python
def anonymize_comment(comment):
    """Remove identifying information from comments."""
    return {
        "evidence_id": comment["evidence_id"],
        "text": comment["text"],
        "author": "[anonymized]",
        "timestamp": comment["timestamp"],
        "engagement": comment["engagement"]
    }
```

## PII Detection

Scan evidence for potential PII before storage:

```python
def detect_pii(text):
    """Flag potential PII in evidence."""
    patterns = {
        "email": r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
        "phone": r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
        "ssn": r'\b\d{3}-\d{2}-\d{4}\b'
    }
    
    flags = []
    for pii_type, pattern in patterns.items():
        if re.search(pattern, text):
            flags.append(pii_type)
    
    return flags
```

---

# Evidence Audit Log

Track all evidence access:

```json
{
  "timestamp": "2024-12-22T15:30:00Z",
  "action": "evidence_accessed",
  "evidence_id": "E00145",
  "accessed_by": "agent:OI-11",
  "context": "brand_platform_synthesis",
  "run_id": "uuid"
}
```

---

# Quick Reference

## ID Patterns

| Pattern | Example | Use |
|---------|---------|-----|
| `E#####` | E00145 | Text evidence |
| `VE#####` | VE00089 | Visual evidence |
| `EC#####` | EC00234 | Comment evidence |
| `URL-#####` | URL-00023 | Page identifier |
| `IMG-#####` | IMG-00089 | Image identifier |
| `POST-#####` | POST-00156 | Social post identifier |

## Citation Format

| Context | Format |
|---------|--------|
| JSON | `"evidence_ids": ["E00145", "E00267"]` |
| Report | `(E00145, E00267)` |
| Single | `(E00145)` |
| Range | `(E00145-E00150)` — avoid, list individually |

## Validation Checklist

- [ ] All evidence IDs match pattern
- [ ] All referenced IDs exist in ledger
- [ ] No orphan IDs in outputs
- [ ] Citation density meets targets
- [ ] PII scan completed
- [ ] Anonymization applied to comments

---

# End of Evidence System Document


---

