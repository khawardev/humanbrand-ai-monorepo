

export const AIAG_VERSION = "25.1";
export const AIAG_LOGO = "https://i.postimg.cc/ZYDgZQyF/aiag-logo.jpg";
export const MAX_CHAT_HISTORY_MESSAGES = 20;


export const GEMINI_MODEL_NAME = "gemini-2.5-pro-preview-05-06";
export const OPENAI_MODEL_NAME = "gpt-4.1"; 

export const IMAGE_MODEL_TO_USE = "gpt-image-1";
export const TTS_MODEL_TO_USE = "gpt-4o-mini-tts";
export const STT_MODEL_TO_USE = "gpt-4o-transcribe";


export const AIAG_CORE_VOICE = "Engaged, Expert, Unifying, Pragmatic";
export const AIAG_KEY_VALUES = "Best-in-Class, Transparency, Collaboration, Cost-Efficiency";
export const AIAG_USP = "Only AIAG convenes the industry’s brightest minds in a neutral, legally safe space to forge standards that raise performance and slash compliance cost & complexity—empowering every member to compete, grow, and succeed.";
export const AIAG_MISSION_FOCUS = "Unite and guide automotive leaders—within a neutral, non‑competitive forum—to develop practical, best‑in‑class standards, tools, and training that lower cost, cut complexity, and boost quality, supply‑chain efficiency, and corporate responsibility.";
export const AIAG_CRITICAL_CONSTRAINTS = "MUST maintain neutrality. MUST NOT speak negatively about specific members or companies. MUST ensure communications support a 'legally safe' environment. MUST be factually accurate. MUST adhere to AIAG's non-profit, collaborative, non-competitive model. Content MUST align with AIAG Brand Platform (the KB Section 1) and Messaging Framework (the KB Section 2).";
export const KNOWLEDGE_BASE_FALLBACK = 'Knowledge Base context is limited due to loading error. Adhere strictly to embedded guidelines and the parameters above.';
export const USER_UPLOADED_FALLBACK = 'None Provided';

export const CONTEXTUAL_AWARENESS_PROMPT_TEMPLATE = `
**Contextual Awareness Input (User-provided trends / challenges / opportunities):**
* (This section is for the user to optionally provide brief, current insights. If the user fills this in the text area below, use it to make the content more timely and relevant. If empty, proceed without it.)*
* **Recent Trends:** [User might input bullet points here]
* **Challenges:** [User might input bullet points here]
* **Opportunities:** [User might input bullet points here]
`;