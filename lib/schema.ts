import { z } from "zod"
import { VALIDATION } from "./constants"

export const ideaSchema = z.object({
  type: z.literal("idea"),
  text: z
    .string()
    .min(VALIDATION.IDEA_MIN_LENGTH, `Idea must be at least ${VALIDATION.IDEA_MIN_LENGTH} characters`)
    .max(VALIDATION.IDEA_MAX_LENGTH, `Idea must be no more than ${VALIDATION.IDEA_MAX_LENGTH} characters`)
    .refine((text) => !text.includes("http://") && !text.includes("https://"), {
      message: "Please use the URL tab to analyze Devpost links",
    }),
})

export const urlSchema = z.object({
  type: z.literal("url"),
  url: z
    .string()
    .url("Please enter a valid URL")
    .regex(VALIDATION.DEVPOST_URL_PATTERN, "Please enter a valid Devpost URL"),
})

export const analyzeSchema = z.discriminatedUnion("type", [ideaSchema, urlSchema])

export type AnalyzeInput = z.infer<typeof analyzeSchema>
