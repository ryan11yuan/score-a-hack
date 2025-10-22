"use server";

import { getProjectIdFromUrl } from "@/lib/devpost";
import { analyzeProject } from "@/lib/project";

export async function scrapeAndAnalyzeDevpost(devpostUrl: string) {
  const id = getProjectIdFromUrl(devpostUrl);
  if (!id) {
    return { ok: false, error: "Invalid Devpost URL format." as const };
  }
  const project = await analyzeProject(id);
  if (!project) {
    return { ok: false, error: "Failed to fetch Devpost project." as const };
  }
  return { ok: true as const, project };
}