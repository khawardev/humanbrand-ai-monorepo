
export type ModelAlias = 'recommended' | 'openai' | 'gemini' | 'claude';

export type ContentGenerationType = 'chat' | 'ai_chat';

export interface ContentGenerationInput {
  modelAlias: ModelAlias;
  userPrompt: string;
  systemPrompt?: string;
  type?: ContentGenerationType;
  originalContent?: string;
  conversationHistory?: any[] | string; // Can be array of messages or string (for some models)
  uploadedFileText?: string;
  retrievalStrategy?: 'rag' | 'knowledgeBase';
  temperature?: number;
  images?: string[];
}

export interface ContentGenerationResult {
  generatedText: string | null;
  errorReason: string | null;
}

export interface SessionTitleInput {
    modelAlias: ModelAlias;
    userPrompt: string;
    temperature?: number;
}
