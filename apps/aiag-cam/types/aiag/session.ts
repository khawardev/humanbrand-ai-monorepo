
export interface SessionData {
  userId: string;
  modelId: string | number;
  audienceIds: number[];
  subjectId: string | number;
  contentTypeIds: number[];
  ctaIds: number[];
  socialPlatformId: string | number | null;
  referenceFileInfos?: any[];
  referenceFilesData?: string | null;
  additionalInstructions?: string | null;
  contextualAwareness?: string | null;
  tone?: number;
  temperature: number;
}

export interface ExistingContentSessionData {
  userId: string;
  modelId: string | number;
  referenceFileInfos: any[];
  referenceFilesData?: string | null;
  referencePdfData?: string | null;
  additionalInstructions?: string | null;
  contextualAwareness?: string | null;
  tone?: number;
  temperature: number;
}

export interface CampaignContentSessionData {
    userId: string;
    modelId: string | number;
    campaignTypeId: number;
    referenceFileInfos?: any[];
    referenceFilesData?: string | null;
    additionalInstructions?: string | null;
    selectedCampaignLabel: string;
    modelAlias: string;
    temperature: number;
}
