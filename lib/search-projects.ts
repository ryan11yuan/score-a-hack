import { DevPostProject, TeamMember } from "./devpost";

interface DevPostSearchResult {
  slug: string;
  photo: string;
  name: string;
  tagline: string;
  members: TeamMember[];
  tags: string[];
}

interface DevPostSearchResponse {
  software: DevPostSearchResult[];
}

const toDevPostProject = (s: DevPostSearchResult): DevPostProject => ({
  id: s.slug,
  photo: s.photo,
  title: s.name.replace(/&amp;/g, "&"),
  tagline: s.tagline,
  members: s.members,
  tags: s.tags,
  images: [],
  description: "",
  links: []
});

export const searchProjects = async (query: string): Promise<DevPostProject[]> => {
  const MAX_PROJECTS = 20;
  const projects: DevPostProject[] = [];
  let running = true;

  for (let page = 1; running && projects.length < MAX_PROJECTS && page < 10; page++) {
    const url = new URL("https://devpost.com/software/search");
    url.searchParams.append("query", query);
    url.searchParams.append("page", page.toString());

    let content: DevPostSearchResponse | undefined;

    try {
      const response = await fetch(url);
      if (response.ok) {
        content = await response.json();
      } else {
        console.error("Failed to fetch", response.status, response.statusText);
      }
    } catch (error) {
      console.error(error);
    }

    if (!content?.software?.length) {
      running = false;
    } else {
      const mapped = content.software.map(toDevPostProject);
      projects.push(...mapped);
      if (projects.length >= MAX_PROJECTS) {
        running = false;
      }
    }
  }

  return projects.slice(0, MAX_PROJECTS);
};