
import { z } from 'zod';

export const socialHandlesSchema = z.object({
  linkedin: z.string().optional(),
  youtube: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  tiktok: z.string().optional(),
});

export const competitorSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  website: z.string().url("Invalid URL"),
  socials: socialHandlesSchema,
});

export const channelSettingsSchema = z.object({
  enabled: z.boolean(),
  lookbackDays: z.number().min(1).default(365),
  maxPosts: z.number().min(50).default(200),
  collectComments: z.boolean().default(true),
});

export const channelScopeSchema = z.object({
  linkedin: channelSettingsSchema,
  youtube: channelSettingsSchema,
  instagram: channelSettingsSchema,
  twitter: channelSettingsSchema,
  facebook: channelSettingsSchema,
  tiktok: channelSettingsSchema,
});

export const engagementDetailsSchema = z.object({
  engagementName: z.string().min(3, "Engagement name must be at least 3 characters"),
  clientName: z.string().min(2, "Client name is required"),
  clientWebsite: z.string().url("Invalid client website URL").optional().or(z.literal('')),
  clientSocials: socialHandlesSchema.optional(),
  industry: z.string().optional(),
});

export const scrapeSettingsSchema = z.object({
  webLimit: z.number().min(1).default(10),
});

export const engagementConfigSchema = z.object({
  details: engagementDetailsSchema,
  competitors: z.array(competitorSchema),
  channels: channelScopeSchema,
  scrapeSettings: scrapeSettingsSchema,
});

export type EngagementConfigV2 = z.infer<typeof engagementConfigSchema>;
