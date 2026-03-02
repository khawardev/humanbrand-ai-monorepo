# Batch Processing API

> **Base URL:** `https://api-beta.brandos.humanbrand.ai`

---

## Overview

The Batch Processing API enables automated batch scraping operations for websites and social media. These endpoints handle large-scale data collection for brands and their competitors.

**Authorization Required:** All endpoints require a valid Bearer token.

---

## Website Batch Scraping

### POST `/batch/website-preview`
**Preview Website Batch Scrape** 🔒

Preview which URLs will be scraped for a batch web scrape without starting the job.

**Authorization Required:** Yes

**Request Body:**
```json
{
  "client_id": "string",
  "brand_id": "string",
  "limit": 100,
  "name": "string"
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `client_id` | string | Yes | - | Client ID |
| `brand_id` | string | Yes | - | Brand ID |
| `limit` | integer | No | 100 | Max pages per URL |
| `name` | string | No | - | Batch job name |

**Response:** `200 OK`
```json
{
  "brand_urls": [
    "https://acme.com",
    "https://acme.com/about",
    "https://acme.com/products"
  ],
  "competitor_urls": {
    "comp-001": [
      "https://competitor1.com",
      "https://competitor1.com/about"
    ]
  },
  "total_urls": 5
}
```

---

### POST `/batch/website`
**Start Website Batch Scrape** 🔒

Start a batch web scraping job for a brand and its competitors. Scrapes HTML and markdown content, storing them compressed in the database.


Start a batch web scraping job for a brand and its competitors.

This endpoint initiates asynchronous web scraping for the specified brand and all its competitors. It scrapes HTML and markdown content from website URLs, storing them compressed in the database. The scraping runs in the background, and results can be retrieved later via the result endpoints.

Input:

client_id (str): The ID of the client.
brand_id (str): The ID of the brand.
limit (int, optional): Maximum number of pages to scrape per URL. Defaults to 100.
name (str, optional): Optional name for the batch job.
Output:

task_id (str): Unique ID of the batch job for tracking.
status (str): Initiation status, typically "Processing started".
Usage: Send a POST request to /batch/website with the input data. Example: { "client_id": "client123", "brand_id": "brand456", "limit": 50, "name": "My Batch Scrape" }

Check status with GET /batch/website-task-status/{client_id}/{brand_id}/{task_id} Retrieve markdown results with GET /batch/website-scrape-results/{client_id}/{brand_id}/{task_id}

Retrieve HTML results with GET /batch/website-scrape-html-results/{client_id}/{brand_id}/{task_id}
**Authorization Required:** Yes

**Request Body:**
```json
{
  "client_id": "string",
  "brand_id": "string",
  "limit": 100,
  "name": "My Batch Scrape"
}
```

**Response:** `202 Accepted`
```json
{
  "task_id": "batch-123456",
  "status": "Processing started"
}
```

---

### GET `/batch/website-task-status/{batch_id}`
**Get Website Batch Status** 🔒

Get the status of a website batch job.

**Path Parameters:**
`batch_id` (string): The batch job ID

**Query Parameters:**
`client_id` (string), `brand_id` (string)

**Response:** `200 OK`
```json
{
  "batch_id": "batch-123456",
  "status": "Processing",
  "progress": {
    "total_urls": 50,
    "completed": 25,
    "failed": 2
  }
}
```

---

### GET `/batch/website-scrapes`
**Get Batch Website Scrapes** 🔒

Retrieve a list of all batch web scrapes for a specific brand.

**Query Parameters:**
`client_id` (string), `brand_id` (string)

**Response:** `200 OK`

---

### GET `/batch/website-scrape-results`
**Get Batch Website Scrape Results**

Retrieve all scraped markdown content for a specific batch web scrape.


Retrieve all scraped markdown content for a specific batch web scrape, structured by brand and competitors.

This endpoint fetches the markdown content scraped during a batch job, organized by brand and competitor. It returns the content, status, and metadata for the batch operation.

Path Parameters:

client_id (str): The ID of the client.
brand_id (str): The ID of the brand.
batch_id (str): The unique ID of the batch job.
Output Structure: { "batch_id": "string", "status": "Completed" | "Processing" | "Failed" | "CompletedWithErrors", "scraped_at": "ISO 8601 timestamp", "pages_scraped": integer, "brand": { "pages": [ { "url": "string", "content": "markdown string" }, ... ] }, "competitors": [ { "competitor_id": "string", "name": "string", "pages": [ { "url": "string", "content": "markdown string" }, ... ] }, ... ] }

Usage: After starting a batch scrape with POST /batch/website, check status, then use this endpoint once completed. Example: GET /batch/website-scrape-results/abc123/def456/ghi789

Note: Content is provided as markdown for readability.

**Query Parameters:**
`client_id`, `brand_id`, `batch_id`

**Response:** `200 OK`
```json
{
  "batch_id": "693b21b6-9517-4050-9943-71c7d50cc8f4",
  "status": "CompletedWithErrors",
  "scraped_at": "2026-01-08T09:47:05.531595",
  "pages_scraped": 3,
  "brand": {
    "pages": [
      {
        "url": "https://www.humanbrand.ai/",
        "content": "Humanbrand AI\n![](https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/662a69abfd90100cc4684e76_hb_logo-green.svg)\n[\nBook a demo\n](#contact-form)\n[\nLet's make it\n![](https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/66099a9b5f04886eb0decdff_arrows-down-white.svg)\n](#about)\n# What's your brand DNA?\n### Humanbrand AI Brand OS\n### \\_Strategic\n### clarity\n### \\_On-brand\n### content\n### \\_Real-time\n### control\n### \\_Competitve\n### edge\n[### see how\n![](https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/66099a9b5f04886eb0decdff_arrows-down-white.svg)\n](#times)\n## Brand clarity today. On-brand content forever.\nTraditional branding is slow, costly, and outpaced by today’s market cycles. **‍****Humanbrand AI Brand OS** compresses the entire journey into a single, secure platform:\n**\\_****Clarity in days** — your purpose, promise, and voice distilled for the boardroom.\n\\_**On-brand content on demand** — social, emails, white-papers and more generated in seconds.\n\\_**Continuous control** — live pulse scoring keeps every touchpoint—and your rivals— in view.\n*Built on People + AI, never People vs. AI. *\nAlready delivering brand performance for forward-looking organizations.\n[\nBook a demo\n](#contact-form)\n![](https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/662a69abfd90100cc4684e76_hb_logo-green.svg)\n## Clarify→Create→Control\n#### *Brand meaning and launch-ready assets in days, not months.*\n01\n#### Clarify\nWe capture your existing insight, then our Clarity Engine distills a board-ready Brand DNA—purpose, promise, voice—in &lt; 7 days.\n02\n#### Create\nThe Content Studio turns that DNA into executive-grade copy—posts, website, emails—instantly and always on-brand.\n03\n#### Control\nBrand Pulse monitors your live site and competitors, rewrites drift, and surfaces whitespace so you stay ahead\n[\nBook a demo\n](#contact-form)\n### Who we are\nHuman Brand AI is an Agentic AI brand DNA agency transforming the way forward-thinking brands connect with their audience, ensuring every story told is data-driven, impactful, and uniquely tailored for the here and now.\n![](https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661d5e218d9c4d48e0b26e8f_aaron.jpg)\nAaron Waterman\nCo-Founder, CEO\n[\nAaron@humanbrand.ai\n](mailto:aaron@humanbrand.ai)\n![](https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661d5e333c9e65bbf5ca7e61_john.jpg)\nJohn O'Brien\nCo-Founder, CSO\n[\nJohn@humanbrand.ai\n](mailto:john@humanbrand.ai)\n![](https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/675dd840c02f9846abaf10d5_gabe.jpg)\nGabe Flavin\nCXO\n[\nGabe@humanbrand.ai\n](mailto:gabe@humanbrand.ai)\n![](https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/676571bfaa72c786bff67931_riz.jpg)\n'Riz' Rizwan Ahmed Mughal\nCTO\n[\nRiz@humanbrand.ai\n](mailto:riz@humanbrand.ai)",
        "html_content": "<html data-wf-domain=\"www.humanbrand.ai\" class=\"w-mod-js w-mod-ix lenis lenis-smooth\" data-wf-site=\"65bab4c139a3ece37559003c\" data-wf-page=\"65bab4c139a3ece375590040\"><style>.wf-force-outline-none[tabindex=\"-1\"]:focus{outline:none;}</style><meta charset=\"utf-8\"><title>Humanbrand AI</title><meta name=\"description\" content=\"Leverage the power of AI for captivating brand storytelling. Human Brand AI crafts narratives that resonate with audiences using cutting-edge artificial intelligence technology.\"><meta content=\"Humanbrand AI\" property=\"og:title\"><meta property=\"og:description\" content=\"Leverage the power of AI for captivating brand storytelling. Human Brand AI crafts narratives that resonate with audiences using cutting-edge artificial intelligence technology.\"><meta content=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661d66c55d50c3b7fe5a519f_humanbrandai.jpg\" property=\"og:image\"><meta content=\"Humanbrand AI\" property=\"twitter:title\"><meta content=\"Leverage the power of AI for captivating brand storytelling. Human Brand AI crafts narratives that resonate with audiences using cutting-edge artificial intelligence technology.\" property=\"twitter:description\"><meta content=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661d66c55d50c3b7fe5a519f_humanbrandai.jpg\" property=\"twitter:image\"><meta property=\"og:type\" content=\"website\"><meta content=\"summary_large_image\" name=\"twitter:card\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><meta content=\"Webflow\" name=\"generator\"><link type=\"text/css\" rel=\"stylesheet\" href=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/css/humanbrandai.webflow.shared.fbbf27753.css\"><link rel=\"preconnect\" href=\"https://fonts.googleapis.com\"><link href=\"https://fonts.gstatic.com\" rel=\"preconnect\" crossorigin=\"anonymous\"><script src=\"https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js\" type=\"text/javascript\"></script><script type=\"text/javascript\">WebFont.load({  google: {    families: [\"Open Sans:300,300italic,400,400italic,600,600italic,700,700italic,800,800italic\"]  }});</script><script type=\"text/javascript\">!function(o,c){var n=c.documentElement,t=\" w-mod-\";n.className+=t+\"js\",(\"ontouchstart\"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+\"touch\")}(window,document);</script><link rel=\"shortcut icon\" type=\"image/x-icon\" href=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661bee149457b5f44f01cb7a_fav-32.png\"><link rel=\"apple-touch-icon\" href=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661bee33838392f6318a4777_fav-%20256.png\"><style>\n    html.lenis {\n      height: auto;\n    }\n    .lenis.lenis-smooth {\n      scroll-behavior: auto;\n    }\n    .lenis.lenis-smooth [data-lenis-prevent] {\n      overscroll-behavior: contain;\n    }\n    .lenis.lenis-stopped {\n      overflow: hidden;\n    }\n</style>\n\n<link rel=\"stylesheet\" href=\"https://unpkg.com/mouse-follower@1/dist/mouse-follower.min.css\">\n\n<style>\n.mf-cursor-text{\nfont-weight:500;\ncolor:black;\n}\n\n.mf-cursor.-text:before{\nopacity:1;\n}\n.mf-cursor:before{\nbackground:white;\n}\n</style>\n\n <script defer=\"\" src=\"https://cdn.usefathom.com/script.js\" data-site=\"ODDFFIGL\"></script> <div class=\"navigation-main\"><div class=\"div-block-67\"><div class=\"logo\"><img loading=\"lazy\" alt=\"\" src=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/662a69abfd90100cc4684e76_hb_logo-green.svg\"></div><div class=\"div-block-68\"><a class=\"btn-book w-inline-block\" href=\"#contact-form\"><div>Book a demo</div></a></div></div><div class=\"div-block-66\"></div></div><div class=\"root\"><div id=\"home\" class=\"section hero\"><a class=\"cta-arrow w-inline-block w--current\" href=\"#about\" style=\"opacity: 1;\"><div class=\"text-block-17\">Let's make it</div><div class=\"cta-arrow-con\"><img class=\"image\" alt=\"\" loading=\"lazy\" src=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/66099a9b5f04886eb0decdff_arrows-down-white.svg\"></div></a><div class=\"title-wrapper\"><h1 class=\"hero-title\" style=\"translate: none; rotate: none; scale: none; opacity: 1; transform: translate(0px, -30px);\">What's your brand DNA?</h1></div><div class=\"spline-con\"><div loading=\"eager\" data-spline-url=\"https://prod.spline.design/eRd3nD41lvWzb0tj/scene.splinecode\" data-w-id=\"5f629b78-0a5b-ab02-50eb-3ccdc1b71642\" data-animation-type=\"spline\" class=\"spline-100\"><canvas width=\"1784\" style=\"display: block; width: 100%; height: 100%;\" height=\"892\"></canvas></div></div></div><div id=\"about\" class=\"section gradient-bkg-1 section2\"><div class=\"right\" id=\"w-node-_7a795354-c4a1-e7fe-ba0c-3dc63b9e1c1f-75590040\"><div class=\"spline-con-copy\"><div data-w-id=\"5092a540-3810-fbdc-c53d-eee5aa18bff7\" data-animation-type=\"spline\" class=\"spline-100\" data-spline-url=\"https://prod.spline.design/ntWyqIOMdXiBD7yT/scene.splinecode\"><canvas style=\"display: block; width: 100%; height: 100%;\" width=\"1784\" height=\"892\"></canvas></div></div></div><div id=\"w-node-_46b5e047-2ed1-2966-a9ee-6297d3f4d2ad-75590040\" class=\"left\"><div class=\"text-wrapper\"><div class=\"text-con\" style=\"translate: none; rotate: none; scale: none; opacity: 1; transform: translate(0px, 0px);\"><h3 class=\"header-large logo-type\">Humanbrand AI Brand OS</h3></div><div style=\"translate: none; rotate: none; scale: none; opacity: 1; transform: translate(0px, 0px);\" class=\"text-con\"><h3 class=\"highlight\">_Strategic</h3><h3>clarity</h3></div><div class=\"text-con\" style=\"translate: none; rotate: none; scale: none; opacity: 1; transform: translate(0px, 0px);\"><h3 class=\"highlight\">_On-brand</h3><h3>content</h3></div><div class=\"text-con\" style=\"translate: none; rotate: none; scale: none; opacity: 1; transform: translate(0px, 0px);\"><h3 class=\"highlight\">_Real-time</h3><h3>control</h3></div><div class=\"text-con\" style=\"translate: none; rotate: none; scale: none; opacity: 1; transform: translate(0px, 0px);\"><h3 class=\"highlight\">_Competitve </h3><h3>edge</h3></div><div class=\"next-con\"><a style=\"translate: none; rotate: none; scale: none; opacity: 1; transform: translate(0px, 0px);\" href=\"#times\" class=\"cta-arrow-2 w-inline-block\"><h3 class=\"highlight\">see how</h3><div class=\"cta-arrow-con\"><img src=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/66099a9b5f04886eb0decdff_arrows-down-white.svg\" loading=\"lazy\" alt=\"\" class=\"image\"></div></a></div></div></div></div><div class=\"section times grid\" id=\"times\"><div class=\"content-con col\"><div class=\"spacer-sm\"></div><div class=\"text-wrapper\"><div class=\"text-con\"><h2>Brand clarity today. On-brand content forever.</h2></div><div class=\"text-con\"><p class=\"p-large\">Traditional branding is slow, costly, and outpaced by today’s market cycles. <strong>‍</strong><span class=\"text-span\"><strong>Humanbrand AI Brand OS</strong> </span>compresses the entire journey into a single, secure platform:<br><strong>_</strong><strong>Clarity in days</strong> — your purpose, promise, and voice distilled for the boardroom.<br>_<strong>On-brand content on demand</strong> — social, emails, white-papers and more generated in seconds.<br>_<strong>Continuous control</strong> — live pulse scoring keeps every touchpoint—and your rivals— in view.<span class=\"text-span\"> <br><br><em>Built on People + AI, never People vs. AI. </em></span><br>Already delivering brand performance for forward-looking organizations.<br></p></div><div class=\"spacer-sm\"></div><a href=\"#contact-form\" class=\"btn-book w-inline-block\"><div>Book a demo</div></a></div><div class=\"spacer-med\"></div><div class=\"spacer-med\"></div><div class=\"spacer-40-copy\"></div></div><div class=\"content-con left col\"><div class=\"image-float\"><div class=\"div-block-70\"><img src=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/662a69abfd90100cc4684e76_hb_logo-green.svg\" loading=\"lazy\" alt=\"\" class=\"user\"></div><div data-autoplay=\"true\" data-video-urls=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661c6971692ba43565726b2a_data-video-transcode.mp4,https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661c6971692ba43565726b2a_data-video-transcode.webm\" data-poster-url=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661c6971692ba43565726b2a_data-video-poster-00001.jpg\" data-loop=\"true\" class=\"background-video w-background-video w-background-video-atom\" data-wf-ignore=\"true\"><video id=\"b5397bdf-2e59-d2b5-e6be-8e21b7c4d651-video\" data-object-fit=\"cover\" style=\"background-image:url(&quot;https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661c6971692ba43565726b2a_data-video-poster-00001.jpg&quot;)\" muted=\"\" playsinline=\"\" loop=\"\" autoplay=\"\" data-wf-ignore=\"true\"><source src=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661c6971692ba43565726b2a_data-video-transcode.mp4\" data-wf-ignore=\"true\"><source src=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661c6971692ba43565726b2a_data-video-transcode.webm\" data-wf-ignore=\"true\"></video></div></div></div></div><div class=\"section services grid\"><div class=\"content-con-2 col\"><div class=\"text-wrapper\"><div class=\"title-con-services\"><h2>Clarify→Create→Control</h2></div><div class=\"title-con-services-copy\"><h4 class=\"heading-11\"><em>Brand meaning and launch-ready assets in days, not months.</em></h4></div><div class=\"div-block-2\"><div class=\"plan-con\"><div class=\"div-block-3\"><div class=\"intakenumber\">01</div></div><div class=\"div-block-4\"><h4 class=\"h-pink\">Clarify</h4></div><p class=\"p-med\" id=\"w-node-e6419ae0-af9c-e67e-ec1f-a9545737cc46-75590040\">We capture your existing insight, then our Clarity Engine distills a board-ready Brand DNA—purpose, promise, voice—in &lt; 7 days.</p></div><div class=\"plan-con\"><div class=\"div-block-3\"><div class=\"intakenumber\">02</div></div><div id=\"w-node-cf6e613c-d29f-24f4-a1ef-a404329cb5c0-75590040\" class=\"div-block-4\"><h4 class=\"h-pink\">Create</h4></div><p id=\"w-node-cf6e613c-d29f-24f4-a1ef-a404329cb5c3-75590040\" class=\"p-med\">The Content Studio turns that DNA into executive-grade copy—posts, website, emails—instantly and always on-brand.</p></div><div class=\"plan-con\"><div class=\"div-block-3\"><div class=\"intakenumber\">03</div></div><div id=\"w-node-d1f67968-9be9-afdd-4c4d-4f1ce0a9a955-75590040\" class=\"div-block-4\"><h4 class=\"h-pink\">Control</h4></div><p id=\"w-node-d1f67968-9be9-afdd-4c4d-4f1ce0a9a958-75590040\" class=\"p-med\">Brand Pulse monitors your live site and competitors, rewrites drift, and surfaces whitespace so you stay ahead</p></div></div></div></div><div class=\"cta-con\"><a href=\"#contact-form\" class=\"btn-book w-inline-block\"><div>Book a demo</div></a></div></div><div class=\"section who grid hide\"><div class=\"content-con-3 col\"><div class=\"text-wrapper\"><div class=\"title-con-who\"><h3>Who we are</h3></div><div class=\"service-detail-con-copy\"><p class=\"p-large\">Human Brand AI is an Agentic AI brand DNA agency transforming the way forward-thinking brands connect with their audience, ensuring every story told is data-driven, impactful, and uniquely tailored for the here and now.</p></div></div><div class=\"who-wrapper\"><div class=\"who-con\"><div class=\"who-icon\"><img sizes=\"100vw\" srcset=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661d5e218d9c4d48e0b26e8f_aaron-p-500.jpg 500w, https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661d5e218d9c4d48e0b26e8f_aaron-p-800.jpg 800w, https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661d5e218d9c4d48e0b26e8f_aaron-p-1080.jpg 1080w, https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661d5e218d9c4d48e0b26e8f_aaron.jpg 1229w\" alt=\"\" src=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661d5e218d9c4d48e0b26e8f_aaron.jpg\" loading=\"lazy\"></div><div class=\"who-detail-con\"><div>Aaron Waterman</div><div class=\"text-block-14\">Co-Founder, CEO</div><a href=\"mailto:aaron@humanbrand.ai\" class=\"cta-email w-inline-block\"><div>Aaron@humanbrand.ai</div></a></div></div><div class=\"who-con\"><div class=\"who-icon\"><img sizes=\"100vw\" srcset=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661d5e333c9e65bbf5ca7e61_john-p-500.jpg 500w, https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661d5e333c9e65bbf5ca7e61_john-p-800.jpg 800w, https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661d5e333c9e65bbf5ca7e61_john.jpg 866w\" class=\"image-zoom\" loading=\"lazy\" src=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661d5e333c9e65bbf5ca7e61_john.jpg\" alt=\"\"></div><div class=\"who-detail-con\"><div>John O'Brien </div><div class=\"text-block-15\">Co-Founder, CSO</div><a class=\"cta-email w-inline-block\" href=\"mailto:john@humanbrand.ai\"><div>John@humanbrand.ai</div></a></div></div><div class=\"who-con\"><div class=\"who-icon\"><img loading=\"lazy\" alt=\"\" src=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/675dd840c02f9846abaf10d5_gabe.jpg\"></div><div class=\"who-detail-con\"><div>Gabe Flavin</div><div class=\"text-block-16\">CXO<br></div><a class=\"cta-email w-inline-block\" href=\"mailto:gabe@humanbrand.ai\"><div>Gabe@humanbrand.ai</div></a></div></div><div class=\"who-con\"><div class=\"who-icon\"><img src=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/676571bfaa72c786bff67931_riz.jpg\" alt=\"\" loading=\"lazy\"></div><div class=\"who-detail-con\"><div>'Riz' Rizwan Ahmed Mughal</div><div class=\"text-block-14\">CTO</div><a href=\"mailto:riz@humanbrand.ai\" class=\"cta-email w-inline-block\"><div>Riz@humanbrand.ai</div></a></div></div></div></div></div></div><style>:root {--variable: clamp(2rem, 1.5675675675675675rem + 2.1621621621621623vw, 4rem);--padding--small: clamp(0.5rem, 0.17567567567567569rem + 1.6216216216216217vw, 2rem);--sizing--h1: clamp(2rem, 0.8108108108108109rem + 5.9459459459459465vw, 7.5rem);--sizing--h2: clamp(2rem, 1.5675675675675675rem + 2.1621621621621623vw, 4rem);--sizing--p: clamp(0.875rem, 0.7668918918918919rem + 0.5405405405405406vw, 1.375rem);--padding--medium: clamp(1rem, 0.35135135135135137rem + 3.2432432432432434vw, 4rem);--padding--large: clamp(2rem, 0.40540540540540543rem + 7.972972972972974vw, 9.375rem);--sizing--nav: clamp(0.875rem, 0.7668918918918919rem + 0.5405405405405406vw, 1.375rem);}</style><script type=\"text/javascript\" crossorigin=\"anonymous\" integrity=\"sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=\" src=\"https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=65bab4c139a3ece37559003c\"></script><script src=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/js/webflow.schunk.36b8fb49256177c8.js\" type=\"text/javascript\"></script><script src=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/js/webflow.schunk.e58153e8ea5c2e95.js\" type=\"text/javascript\"></script><script type=\"text/javascript\" src=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/js/webflow.6b6a2fea.b1417b8a36a5bc39.js\"></script>\n\n\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js\"></script>\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js\"></script>\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js\"></script>\n\n<script src=\"https://unpkg.com/split-type\"></script>\n\n\n\n<script src=\"https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsfilter@1/cmsfilter.js\" async=\"\"></script>\n\n<script src=\"https://unpkg.com/@studio-freight/lenis@1.0.34/dist/lenis.min.js\"></script> \n\n<script>\n\nconst lenis = new Lenis()\n\nlenis.on('scroll', (e) => {\n  //console.log(e)\n})\n\nlenis.on('scroll', ScrollTrigger.update)\n\ngsap.ticker.add((time)=>{\n  lenis.raf(time * 1000)\n})\n\ngsap.ticker.lagSmoothing(0)\n</script>\n\n\n\n\n<script>let v=\"1.0\";document.addEventListener(\"DOMContentLoaded\", function() {function loadhumanbrandai(e){let t=document.createElement(\"script\");t.setAttribute(\"src\",e),t.setAttribute(\"type\",\"module\"),document.body.appendChild(t),t.addEventListener(\"load\",()=>{console.log(\"Slater loaded Human Brand AI (Slater.app/5634) 🤙\")}),t.addEventListener(\"error\",e=>{console.log(\"Error loading file\",e)})}let src=window.location.host.includes(\"webflow.io\")?\"https://slater.app/5634.js\":\"https://assets.slater.app/slater/5634.js?v=\"+v;loadhumanbrandai(src);})</script>\n\n\n\n\n\n\n\n<script src=\"https://assets.slater.app/slater/5634.js?v=1.0\" type=\"module\"></script></html>",
        "image_urls": [
          "s3://east1-brandos-backend-dev/images/41de24a3-911e-454e-a8e3-03709e98b381.svg",
          "s3://east1-brandos-backend-dev/images/9eb2f3a5-b80f-42f7-996b-37546161122e.svg",
          "s3://east1-brandos-backend-dev/images/9374df2f-5631-4be6-a5c5-d4359a6d2bed.svg",
          "s3://east1-brandos-backend-dev/images/c59ba4d1-54c1-445f-8148-4cea7fa59649.svg"
        ]
      },
      {
        "url": "https://www.humanbrand.ai/privacy-policy",
        "content": "privacy policy\n[\nContact us\n](#contact-form)\n[![](https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/660982143ad06dd143b3fc10_hb_logo_white.svg)](https://www.humanbrand.ai/)\n### **Privacy Policy**\nThis Privacy Policy (\"Policy\") explains how Human Brand AI (\"we\", \"our\", or \"us\") collects, uses, shares, and protects information obtained from visitors (\"you\" or \"your\") of our website [website URL] (\"the Website\").\n**1. Information We Collect**\n1.1. **Information You Provide:** We may collect personal information that you voluntarily provide to us when you interact with the Website, such as when you fill out a contact form or subscribe to our newsletter. This information may include your name, email address, and any other information you choose to provide.\n1.2. **Automatically Collected Information:** We may automatically collect certain information about your device and usage of the Website, including your IP address, browser type, operating system, referring URLs, pages viewed, and other browsing behavior.\n**2. Use of Information**\n2.1. We may use the information we collect for various purposes, including:\n* To provide, maintain, and improve the Website.\n* To respond to your inquiries, questions, and requests.\n* To send you newsletters, marketing communications, and other information about our products and services.\n* To detect, prevent, and address technical issues and security vulnerabilities.\n2.2. We will not use your personal information for purposes other than those described in this Policy without your consent.\n**3. Sharing of Information**\n3.1. We may share your information with third-party service providers who assist us in operating the Website and conducting our business, subject to confidentiality agreements.\n3.2. We may also disclose your information if required by law or if we believe that such action is necessary to comply with legal obligations, protect our rights or property, or ensure the safety of others.\n**4. Data Security**\n4.1. We implement reasonable security measures to protect the confidentiality, integrity, and availability of your information from unauthorized access, disclosure, alteration, or destruction.\n**5. Your Choices**\n5.1. You may choose not to provide certain personal information, although this may limit your ability to access certain features of the Website.\n5.2. You may opt out of receiving marketing communications from us by following the instructions provided in such communications or by contacting us directly.\n**6. Third-Party Links**\n6.1. The Website may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the privacy practices or content of such third-party websites or services.\n**7. Children's Privacy**\n7.1. The Website is not intended for children under the age of 13, and we do not knowingly collect personal information from children under the age of 13. If we become aware that we have inadvertently collected personal information from a child under the age of 13, we will take steps to delete such information.\n**8. Changes to This Policy**\n8.1. We reserve the right to update or change this Policy at any time. Any changes will be effective immediately upon posting the revised Policy on the Website.\n**9. Contact Us**\n9.1. If you have any questions or concerns about this Policy, please contact us at [contact email].\nBy using the Website, you consent to the collection and use of your information as described in this Privacy Policy.\nLast updated: 6/16/2024\n‍",
        "html_content": "<html class=\"w-mod-js lenis lenis-smooth\" data-wf-domain=\"www.humanbrand.ai\" data-wf-page=\"661d65855770c5470b2458a8\" data-wf-site=\"65bab4c139a3ece37559003c\"><style>.wf-force-outline-none[tabindex=\"-1\"]:focus{outline:none;}</style><meta charset=\"utf-8\"><title>privacy policy</title><meta content=\"privacy policy\" property=\"og:title\"><meta property=\"twitter:title\" content=\"privacy policy\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><meta content=\"Webflow\" name=\"generator\"><link type=\"text/css\" rel=\"stylesheet\" href=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/css/humanbrandai.webflow.shared.fbbf27753.css\"><link href=\"https://fonts.googleapis.com\" rel=\"preconnect\"><link href=\"https://fonts.gstatic.com\" crossorigin=\"anonymous\" rel=\"preconnect\"><script type=\"text/javascript\" src=\"https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js\"></script><script type=\"text/javascript\">WebFont.load({  google: {    families: [\"Open Sans:300,300italic,400,400italic,600,600italic,700,700italic,800,800italic\"]  }});</script><script type=\"text/javascript\">!function(o,c){var n=c.documentElement,t=\" w-mod-\";n.className+=t+\"js\",(\"ontouchstart\"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+\"touch\")}(window,document);</script><link href=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661bee149457b5f44f01cb7a_fav-32.png\" type=\"image/x-icon\" rel=\"shortcut icon\"><link href=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661bee33838392f6318a4777_fav-%20256.png\" rel=\"apple-touch-icon\"><style>\n    html.lenis {\n      height: auto;\n    }\n    .lenis.lenis-smooth {\n      scroll-behavior: auto;\n    }\n    .lenis.lenis-smooth [data-lenis-prevent] {\n      overscroll-behavior: contain;\n    }\n    .lenis.lenis-stopped {\n      overflow: hidden;\n    }\n</style>\n\n<link rel=\"stylesheet\" href=\"https://unpkg.com/mouse-follower@1/dist/mouse-follower.min.css\">\n\n<style>\n.mf-cursor-text{\nfont-weight:500;\ncolor:black;\n}\n\n.mf-cursor.-text:before{\nopacity:1;\n}\n.mf-cursor:before{\nbackground:white;\n}\n</style>\n\n <script defer=\"\" src=\"https://cdn.usefathom.com/script.js\" data-site=\"ODDFFIGL\"></script> <div class=\"navigation\"><div class=\"contact-btn-con\"><a class=\"btn-nav btn-white-large w-inline-block\" href=\"#contact-form\"><div>Contact us</div></a></div></div><a class=\"logo-con w-inline-block\" href=\"/\"><img loading=\"lazy\" src=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/660982143ad06dd143b3fc10_hb_logo_white.svg\" alt=\"\" class=\"l-white\"></a><div class=\"root\"><div class=\"section who grid\"><div class=\"content-con-3-copy col\"><div class=\"text-wrapper-copy\"><div class=\"title-con-who-copy\"><h3 class=\"header-large\"><strong>Privacy Policy</strong></h3></div><div class=\"service-detail-con-copy-copy\"><div class=\"w-richtext\"><p>This Privacy Policy (\"Policy\") explains how Human Brand AI (\"we\", \"our\", or \"us\") collects, uses, shares, and protects information obtained from visitors (\"you\" or \"your\") of our website [website URL] (\"the Website\").</p><p><strong>1. Information We Collect</strong></p><p>1.1. <strong>Information You Provide:</strong> We may collect personal information that you voluntarily provide to us when you interact with the Website, such as when you fill out a contact form or subscribe to our newsletter. This information may include your name, email address, and any other information you choose to provide.</p><p>1.2. <strong>Automatically Collected Information:</strong> We may automatically collect certain information about your device and usage of the Website, including your IP address, browser type, operating system, referring URLs, pages viewed, and other browsing behavior.</p><p><strong>2. Use of Information</strong></p><p>2.1. We may use the information we collect for various purposes, including:</p><ul role=\"list\"><li>To provide, maintain, and improve the Website.</li><li>To respond to your inquiries, questions, and requests.</li><li>To send you newsletters, marketing communications, and other information about our products and services.</li><li>To detect, prevent, and address technical issues and security vulnerabilities.</li></ul><p>2.2. We will not use your personal information for purposes other than those described in this Policy without your consent.</p><p><strong>3. Sharing of Information</strong></p><p>3.1. We may share your information with third-party service providers who assist us in operating the Website and conducting our business, subject to confidentiality agreements.</p><p>3.2. We may also disclose your information if required by law or if we believe that such action is necessary to comply with legal obligations, protect our rights or property, or ensure the safety of others.</p><p><strong>4. Data Security</strong></p><p>4.1. We implement reasonable security measures to protect the confidentiality, integrity, and availability of your information from unauthorized access, disclosure, alteration, or destruction.</p><p><strong>5. Your Choices</strong></p><p>5.1. You may choose not to provide certain personal information, although this may limit your ability to access certain features of the Website.</p><p>5.2. You may opt out of receiving marketing communications from us by following the instructions provided in such communications or by contacting us directly.</p><p><strong>6. Third-Party Links</strong></p><p>6.1. The Website may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the privacy practices or content of such third-party websites or services.</p><p><strong>7. Children's Privacy</strong></p><p>7.1. The Website is not intended for children under the age of 13, and we do not knowingly collect personal information from children under the age of 13. If we become aware that we have inadvertently collected personal information from a child under the age of 13, we will take steps to delete such information.</p><p><strong>8. Changes to This Policy</strong></p><p>8.1. We reserve the right to update or change this Policy at any time. Any changes will be effective immediately upon posting the revised Policy on the Website.</p><p><strong>9. Contact Us</strong></p><p>9.1. If you have any questions or concerns about this Policy, please contact us at [contact email].</p><p>By using the Website, you consent to the collection and use of your information as described in this Privacy Policy.</p><p>Last updated: 6/16/2024</p><p>‍</p></div></div></div></div></div></div><script crossorigin=\"anonymous\" type=\"text/javascript\" src=\"https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=65bab4c139a3ece37559003c\" integrity=\"sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=\"></script><script src=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/js/webflow.schunk.e58153e8ea5c2e95.js\" type=\"text/javascript\"></script><script type=\"text/javascript\" src=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/js/webflow.a0aa6ca1.2628b82da48d0a28.js\"></script>\n\n\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js\"></script>\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js\"></script>\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js\"></script>\n\n<script src=\"https://unpkg.com/split-type\"></script>\n\n\n\n<script src=\"https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsfilter@1/cmsfilter.js\" async=\"\"></script>\n\n<script src=\"https://unpkg.com/@studio-freight/lenis@1.0.34/dist/lenis.min.js\"></script> \n\n<script>\n\nconst lenis = new Lenis()\n\nlenis.on('scroll', (e) => {\n  //console.log(e)\n})\n\nlenis.on('scroll', ScrollTrigger.update)\n\ngsap.ticker.add((time)=>{\n  lenis.raf(time * 1000)\n})\n\ngsap.ticker.lagSmoothing(0)\n</script>\n\n\n\n\n<script>let v=\"1.0\";document.addEventListener(\"DOMContentLoaded\", function() {function loadhumanbrandai(e){let t=document.createElement(\"script\");t.setAttribute(\"src\",e),t.setAttribute(\"type\",\"module\"),document.body.appendChild(t),t.addEventListener(\"load\",()=>{console.log(\"Slater loaded Human Brand AI (Slater.app/5634) 🤙\")}),t.addEventListener(\"error\",e=>{console.log(\"Error loading file\",e)})}let src=window.location.host.includes(\"webflow.io\")?\"https://slater.app/5634.js\":\"https://assets.slater.app/slater/5634.js?v=\"+v;loadhumanbrandai(src);})</script>\n\n\n\n\n\n\n\n<script src=\"https://assets.slater.app/slater/5634.js?v=1.0\" type=\"module\"></script></html>",
        "image_urls": [
          "s3://east1-brandos-backend-dev/images/5b063518-8c94-41ce-9184-16d6338213ad.svg"
        ]
      },
      {
        "url": "https://www.humanbrand.ai/terms-of-use",
        "content": "terms of use\n[\nContact us\n](#contact-form)\n[![](https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/660982143ad06dd143b3fc10_hb_logo_white.svg)](https://www.humanbrand.ai/)\n### **Terms of use**\nThese Terms of Use (\"Terms\") govern your access to and use of humanbrandai.com. Please read these Terms carefully before using the Website.\nBy accessing or using the Website, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Website.\n1. Use of the Website\n1.1. You must be at least 18 years old to access or use the Website. By accessing or using the Website, you represent and warrant that you are at least 18 years old.\n1.2. You agree to use the Website only for lawful purposes and in accordance with these Terms.\n1.3. You agree not to:\nUse the Website in any way that violates any applicable law or regulation.\nUse the Website to engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Website.\nUse the Website to transmit, or procure the sending of, any advertising or promotional material without our prior written consent.\n2. Intellectual Property Rights\n2.1. The Website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by Human brand ai or its licensors and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.\n2.2. You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Website for your personal, non-commercial use only.\n3. Disclaimer of Warranties\n3.1. The Website is provided \"as is\" and \"as available\" without warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.\n3.2. Human brand ai does not warrant that the Website will be uninterrupted or error-free, that defects will be corrected, or that the Website or the server that makes it available are free of viruses or other harmful components.\n4. Limitation of Liability\n4.1. In no event shall [Your Company Name], its affiliates, or their respective officers, directors, employees, or agents be liable to you for any indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profits, lost data, personal injury, or property damage, arising from or relating to your use of the Website.\n4.2. Human brand ai's total liability to you for all claims arising out of or relating to these Terms or your use of the Website shall not exceed the amount paid by you, if any, toHuman brand ai for access to or use of the Website during the twelve (12) months prior to the accrual of such claim.\n5. Governing Law\nThese Terms shall be governed by and construed in accordance with the laws of USA, without regard to its conflict of law provisions.\n6. Changes to These Terms\nHuman brand ai reserves the right, at its sole discretion, to modify or replace these Terms at any time. If a revision is material, Human brand ai will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at Human brand ai's sole discretion.\n7. Contact Us\nIf you have any questions about these Terms, please contact us at contact@humanbrandai.com.\nBy using the Website, you agree to be bound by these Terms of Use.\nLast updated: 6/15/2024\n‍",
        "html_content": "<html data-wf-page=\"661d60e8e813165118522f9d\" data-wf-site=\"65bab4c139a3ece37559003c\" data-wf-domain=\"www.humanbrand.ai\" class=\"w-mod-js lenis lenis-smooth\"><style>.wf-force-outline-none[tabindex=\"-1\"]:focus{outline:none;}</style><meta charset=\"utf-8\"><title>terms of use</title><meta content=\"terms of use\" property=\"og:title\"><meta content=\"terms of use\" property=\"twitter:title\"><meta content=\"width=device-width, initial-scale=1\" name=\"viewport\"><meta content=\"Webflow\" name=\"generator\"><link href=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/css/humanbrandai.webflow.shared.fbbf27753.css\" type=\"text/css\" rel=\"stylesheet\"><link href=\"https://fonts.googleapis.com\" rel=\"preconnect\"><link rel=\"preconnect\" crossorigin=\"anonymous\" href=\"https://fonts.gstatic.com\"><script src=\"https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js\" type=\"text/javascript\"></script><script type=\"text/javascript\">WebFont.load({  google: {    families: [\"Open Sans:300,300italic,400,400italic,600,600italic,700,700italic,800,800italic\"]  }});</script><script type=\"text/javascript\">!function(o,c){var n=c.documentElement,t=\" w-mod-\";n.className+=t+\"js\",(\"ontouchstart\"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+\"touch\")}(window,document);</script><link type=\"image/x-icon\" href=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661bee149457b5f44f01cb7a_fav-32.png\" rel=\"shortcut icon\"><link href=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/661bee33838392f6318a4777_fav-%20256.png\" rel=\"apple-touch-icon\"><style>\n    html.lenis {\n      height: auto;\n    }\n    .lenis.lenis-smooth {\n      scroll-behavior: auto;\n    }\n    .lenis.lenis-smooth [data-lenis-prevent] {\n      overscroll-behavior: contain;\n    }\n    .lenis.lenis-stopped {\n      overflow: hidden;\n    }\n</style>\n\n<link rel=\"stylesheet\" href=\"https://unpkg.com/mouse-follower@1/dist/mouse-follower.min.css\">\n\n<style>\n.mf-cursor-text{\nfont-weight:500;\ncolor:black;\n}\n\n.mf-cursor.-text:before{\nopacity:1;\n}\n.mf-cursor:before{\nbackground:white;\n}\n</style>\n\n <script defer=\"\" data-site=\"ODDFFIGL\" src=\"https://cdn.usefathom.com/script.js\"></script> <div class=\"navigation\"><div class=\"contact-btn-con\"><a href=\"#contact-form\" class=\"btn-nav btn-white-large w-inline-block\"><div>Contact us</div></a></div></div><a class=\"logo-con w-inline-block\" href=\"/\"><img class=\"l-white\" loading=\"lazy\" alt=\"\" src=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/660982143ad06dd143b3fc10_hb_logo_white.svg\"></a><div class=\"root\"><div class=\"section who grid\"><div class=\"content-con-3-copy col\"><div class=\"text-wrapper-copy\"><div class=\"title-con-who-copy\"><h3 class=\"header-large\"><strong>Terms of use</strong></h3></div><div class=\"service-detail-con-copy-copy\"><div class=\"w-richtext\"><p>These Terms of Use (\"Terms\") govern your access to and use of humanbrandai.com. Please read these Terms carefully before using the Website.</p><p>By accessing or using the Website, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Website.</p><p>1. Use of the Website</p><p>1.1. You must be at least 18 years old to access or use the Website. By accessing or using the Website, you represent and warrant that you are at least 18 years old.</p><p>1.2. You agree to use the Website only for lawful purposes and in accordance with these Terms.</p><p>1.3. You agree not to:</p><p>Use the Website in any way that violates any applicable law or regulation.</p><p>Use the Website to engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Website.</p><p>Use the Website to transmit, or procure the sending of, any advertising or promotional material without our prior written consent.</p><p>2. Intellectual Property Rights</p><p>2.1. The Website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by Human brand ai or its licensors and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p><p>2.2. You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Website for your personal, non-commercial use only.</p><p>3. Disclaimer of Warranties</p><p>3.1. The Website is provided \"as is\" and \"as available\" without warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.</p><p>3.2. Human brand ai does not warrant that the Website will be uninterrupted or error-free, that defects will be corrected, or that the Website or the server that makes it available are free of viruses or other harmful components.</p><p>4. Limitation of Liability</p><p>4.1. In no event shall [Your Company Name], its affiliates, or their respective officers, directors, employees, or agents be liable to you for any indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profits, lost data, personal injury, or property damage, arising from or relating to your use of the Website.</p><p>4.2. Human brand ai's total liability to you for all claims arising out of or relating to these Terms or your use of the Website shall not exceed the amount paid by you, if any, toHuman brand ai for access to or use of the Website during the twelve (12) months prior to the accrual of such claim.</p><p>5. Governing Law</p><p>These Terms shall be governed by and construed in accordance with the laws of USA, without regard to its conflict of law provisions.</p><p>6. Changes to These Terms</p><p>Human brand ai reserves the right, at its sole discretion, to modify or replace these Terms at any time. If a revision is material, Human brand ai will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at Human brand ai's sole discretion.</p><p>7. Contact Us</p><p>If you have any questions about these Terms, please contact us at contact@humanbrandai.com.</p><p>By using the Website, you agree to be bound by these Terms of Use.</p><p>Last updated: 6/15/2024</p><p>‍</p></div></div></div></div></div></div><script src=\"https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=65bab4c139a3ece37559003c\" type=\"text/javascript\" integrity=\"sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=\" crossorigin=\"anonymous\"></script><script src=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/js/webflow.schunk.e58153e8ea5c2e95.js\" type=\"text/javascript\"></script><script src=\"https://cdn.prod.website-files.com/65bab4c139a3ece37559003c/js/webflow.a0aa6ca1.2628b82da48d0a28.js\" type=\"text/javascript\"></script>\n\n\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js\"></script>\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js\"></script>\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js\"></script>\n\n<script src=\"https://unpkg.com/split-type\"></script>\n\n\n\n<script async=\"\" src=\"https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsfilter@1/cmsfilter.js\"></script>\n\n<script src=\"https://unpkg.com/@studio-freight/lenis@1.0.34/dist/lenis.min.js\"></script> \n\n<script>\n\nconst lenis = new Lenis()\n\nlenis.on('scroll', (e) => {\n  //console.log(e)\n})\n\nlenis.on('scroll', ScrollTrigger.update)\n\ngsap.ticker.add((time)=>{\n  lenis.raf(time * 1000)\n})\n\ngsap.ticker.lagSmoothing(0)\n</script>\n\n\n\n\n<script>let v=\"1.0\";document.addEventListener(\"DOMContentLoaded\", function() {function loadhumanbrandai(e){let t=document.createElement(\"script\");t.setAttribute(\"src\",e),t.setAttribute(\"type\",\"module\"),document.body.appendChild(t),t.addEventListener(\"load\",()=>{console.log(\"Slater loaded Human Brand AI (Slater.app/5634) 🤙\")}),t.addEventListener(\"error\",e=>{console.log(\"Error loading file\",e)})}let src=window.location.host.includes(\"webflow.io\")?\"https://slater.app/5634.js\":\"https://assets.slater.app/slater/5634.js?v=\"+v;loadhumanbrandai(src);})</script>\n\n\n\n\n\n\n\n<script type=\"module\" src=\"https://assets.slater.app/slater/5634.js?v=1.0\"></script></html>",
        "image_urls": [
          "s3://east1-brandos-backend-dev/images/ffeaa49b-3487-4f13-a359-e0cdf0d530ce.svg"
        ]
      }
    ]
  },
  "competitors": []
}
```

---

### GET `/batch/website-scrape-html-results`
**Get Batch Website Scrape HTML Results** 🔒

Retrieve all scraped raw HTML content for a specific batch web scrape.

Retrieve all scraped HTML content for a specific batch web scrape, structured by brand and competitors.

This endpoint fetches the raw HTML content scraped during a batch job, organized by brand and competitor. It returns the decompressed HTML, status, and metadata for the batch operation.

Path Parameters:

client_id (str): The ID of the client.
brand_id (str): The ID of the brand.
batch_id (str): The unique ID of the batch job.
Output Structure: { "batch_id": "string", "status": "Completed" | "Processing" | "Failed" | "CompletedWithErrors", "scraped_at": "ISO 8601 timestamp", "pages_scraped": integer, "brand": { "pages": [ { "url": "string", "html_content": "HTML string" }, ... ] }, "competitors": [ { "competitor_id": "string", "name": "string", "pages": [ { "url": "string", "html_content": "HTML string" }, ... ] }, ... ] }

Usage: After starting a batch scrape with POST /batch/website, check status, then use this endpoint once completed. Example: GET /batch/website-scrape-html-results/abc123/def456/ghi789

Note: HTML content is provided as raw HTML for full fidelity. Content is compressed in the database and decompressed here.


**Query Parameters:**
`client_id`, `brand_id`, `batch_id`

**Response:** `200 OK`

---

## Social Batch Scraping

### POST `/batch/social-preview`
**Preview Social Batch Scrape** 🔒

Preview which social media URLs will be scraped.

**Request Body:**
```json
{
  "client_id": "string",
  "brand_id": "string",
  "name": "string",
  "start_date": "2025-12-01",
  "end_date": "2026-01-07"
}
```

**Response:** `200 OK`

---

### POST `/batch/social`
**Start Social Batch Scrape** 🔒

Start a batch social media scraping job.

**Request Body:**
```json
{
  "client_id": "string",
  "brand_id": "string",
  "name": "Q4 Social Scrape",
  "start_date": "2025-12-01",
  "end_date": "2026-01-07"
}
```

**Response:** `202 Accepted`

---

### GET `/batch/social-task-status/{batch_id}`
**Get Social Batch Status** 🔒

Get the status of a social batch job.

**Path Parameters:**
`batch_id` (string)

**Query Parameters:**
`client_id`, `brand_id`

**Response:** `200 OK`

---

### GET `/batch/social-scrapes`
**Get Batch Social Scrapes** 🔒

Retrieve a list of all batch social scrapes for a specific brand.

**Query Parameters:**
`client_id`, `brand_id`

**Response:** `200 OK`

---

### GET `/batch/social-scrape-results`
**Get Social Scrape Results**

Retrieves all scraped social media content for a given batch.

**Query Parameters:**
`client_id`, `brand_id`, `batch_id`

**Response:** `200 OK`

---

## Schemas

### BatchScrapeRequest (Website)
```typescript
interface BatchScrapeRequest {
  client_id: string;
  brand_id: string;
  limit?: number; // default: 100
  name?: string;
}
```

### BatchSocialScrapeRequest
```typescript
interface BatchSocialScrapeRequest {
  client_id: string;
  brand_id: string;
  name?: string;
  start_date?: string;
  end_date?: string;
}
```

---

[← Back to Documentation Index](./index.md)
