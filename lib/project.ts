import { getDevPostProject } from "./devpost";
import generateDescription from "./generate-description";
import { extractKeywords } from "./extract-keywords";
import { searchProjects } from "./search-projects";
import { analyzeSimilarity } from "./analyze-similarity";

export async function analyzeProject(projectId: string) {
  const project = await getDevPostProject(projectId);
  if (!project?.description) throw new Error("Project not found");

  const structuredDescription = await generateDescription(project.description);
  const keywords = (await extractKeywords(project.description)) ?? [];

  const candidates =
    keywords.length > 0 ? await searchProjects(keywords.join(" ")) : [];

  const similar = await Promise.allSettled(
    candidates
      .filter((p: any) => p?.id && p.id !== project.id)
      .map(async (p: any) => {
        const d = await getDevPostProject(p.id);
        if (!d?.description) return null;
        const similarity = await analyzeSimilarity(project.description, d.description);
        return {
          project: {
            id: d.id,
            title: d.title,
            tagline: d.tagline ?? null,
            images: Array.isArray(d.images) ? d.images : [],
          },
          similarity,
        };
      })
  ).then((res) =>
    res
      .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
      .map((r) => r.value)
      .filter(Boolean)
      .sort(
        (a: any, b: any) => (b?.similarity?.score ?? 0) - (a?.similarity?.score ?? 0)
      )
  );

  return {
    project: {
      id: project.id,
      title: project.title,
      tagline: project.tagline ?? null,
      images: Array.isArray(project.images) ? project.images : [],
      description: project.description,
    },
    structuredDescription,
    keywords,
    similar,
  };
}