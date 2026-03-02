import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

export const todoSchema = z.object({
    title: z.string().min(1, "Title is required"),
    completed: z.boolean().default(false),
});

const competitorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL"),
  facebook_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  x_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  youtube_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  instagram_url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const brandSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL"),
  facebook_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  x_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  youtube_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  instagram_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  competitors: z.array(competitorSchema).optional(),
});

export const crawlWebsiteSchema = z.object({
  url: z.string().url(),
  brand_id: z.string(),
  client_id: z.string(),
  competitor_id: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
