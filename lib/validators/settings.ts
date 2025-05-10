import { z } from "zod";

export const settingsSchema = z.object({
  id: z.string().optional(),
  newspaperName: z
    .string()
    .min(2, "Newspaper name must be at least 2 characters"),
  tagline: z.string().min(2, "Tagline must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  contactEmail: z.string().email("Please enter a valid email address"),
  facebookUrl: z
    .string()
    .url("Please enter a valid URL")
    .or(z.string().length(0))
    .optional(),
  twitterUrl: z
    .string()
    .url("Please enter a valid URL")
    .or(z.string().length(0))
    .optional(),
  instagramUrl: z
    .string()
    .url("Please enter a valid URL")
    .or(z.string().length(0))
    .optional(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
