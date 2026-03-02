---
marp: true
theme: default
size: 16:9
paginate: true
style: |
  /* --- COLOR PALETTE & VARIABLES --- */
  :root {
    --brand-lime: #76ff03;
    --brand-dark: #222222;
    --brand-blue: #0088cc;
    --brand-light: #f4f4f4;
    --text-main: #333333;
    --text-light: #ffffff;
  }

  /* --- GLOBAL TYPOGRAPHY --- */
  section {
    font-family: 'Arial', 'Helvetica', sans-serif;
    font-size: 24px;
    color: var(--text-main);
    background-color: var(--brand-light);
    padding: 40px;
  }

  h1 {
    font-size: 48px;
    font-weight: 800;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 32px;
    font-weight: 700;
    color: var(--brand-dark);
    margin-bottom: 30px;
  }

  h3 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  /* --- SLIDE TYPES --- */

  /* 1. Title Slide (Dark) */
  section.title-slide {
    background-color: var(--brand-dark);
    color: var(--text-light);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  section.title-slide h1 {
    color: var(--text-light);
    font-size: 60px;
  }
  section.title-slide h2 {
    color: var(--brand-lime);
    font-size: 36px;
    margin-top: -20px;
  }
  section.title-slide p {
    color: #cccccc;
    font-size: 18px;
  }

  /* 2. Section Divider (Green) */
  section.section-divider {
    background-color: var(--brand-lime);
    color: var(--brand-dark);
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section.section-divider h1 {
    font-size: 80px;
    color: #000;
  }

  /* 3. Whitespace Card Layout */
  .whitespace-header {
    font-size: 40px;
    font-weight: 900;
    margin-bottom: 20px;
  }
  .blue-banner {
    background-color: var(--brand-blue);
    color: white;
    padding: 15px;
    font-weight: bold;
    text-align: center;
    border-radius: 4px;
    margin-bottom: 20px;
  }
  .grid-2-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
  .grey-box {
    background-color: #e0e0e0;
    padding: 20px;
    border-radius: 8px;
  }

  /* 4. Comparison Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 18px;
  }
  th {
    background-color: var(--brand-lime);
    color: #000;
    font-weight: bold;
    padding: 12px;
    border: 1px solid #000;
    text-align: left;
  }
  td {
    padding: 12px;
    border: 1px solid #000;
    background-color: #fff;
  }
  /* Highlight First Column/Row logic for Brand */
  tr:nth-child(1) td:first-child {
    font-weight: bold;
  }

  /* 5. Archetype Blue Cards */
  .blue-card-container {
    display: flex;
    gap: 20px;
    justify-content: center;
  }
  .blue-card {
    background-color: var(--brand-blue);
    color: white;
    padding: 30px;
    border-radius: 30px;
    width: 45%;
    text-align: center;
  }
  .blue-card h3 {
    font-size: 36px;
    color: white;
  }

  /* Footer Styling */
  footer {
    position: absolute;
    bottom: 20px;
    right: 40px;
    font-size: 12px;
    color: #888;
  }
  header {
    position: absolute;
    top: 20px;
    left: 40px;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    align-items: center;
  }
---

<!-- 
_class: title-slide 
header: ""
footer: "©2026 Humanbrand AI LLC"
-->

# AUDIOCONTROL
## Outside-In Brand & Competitor Audit:
## Websites & Social Media Platforms

January 26, 2026

An Outside-In Analysis of publicly available digital content

---
