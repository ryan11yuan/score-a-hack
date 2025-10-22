import * as cheerio from "cheerio";
import { convert } from "html-to-text";

export type TeamMember = {
  image: string | null;
  name: string | null;
};

export type DevPostProject = {
  id: string;
  title?: string;
  tagline?: string;
  images: string[];
  description: string;
  tags: string[];
  githubLink?: string;
  links: string[];
  members: TeamMember[];
  photo?: string;
};

const trimWhitespaceAndNewlines = (str: string) =>
  str.replace(/^[\s\n]+|[\s\n]+$/g, "");

export function getProjectIdFromUrl(devpostUrl: string): string | null {
  try {
    const u = new URL(devpostUrl);
    // Accept /software/:id or trailing slash
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => p === "software");
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    // Also allow direct ids e.g. https://devpost.com/software-id
    if (parts.length === 1) return parts[0];
    return null;
  } catch {
    return null;
  }
}

export const getDevPostProject = async (
  projectID: string
): Promise<DevPostProject | null> => {
  const url = `https://devpost.com/software/${projectID}`;

  let content: string | undefined;

  try {
    const response = await fetch(url);

    if (response.ok) {
      content = await response.text();
    } else {
      console.error("Failed to fetch", response.status, response.statusText);
    }
  } catch (error) {
    console.error(error);
  }

  if (!content) return null;

  const $ = cheerio.load(content);

  $.html();

  const title = trimWhitespaceAndNewlines(
    $("#app-title").html() || ""
  )?.replace("&amp;", "&");

  const tagline = trimWhitespaceAndNewlines(
    $("#software-header > div:nth-child(1) > div > p").html() || ""
  );

  const images = $(".software_photo_image")
    .map((i, e) => $(e).attr("src"))
    .get()
    .filter((src): src is string => Boolean(src));

  const descriptionHTML = $("#gallery").next().html();
  const description = convert(descriptionHTML as string);

  const tags: string[] = [];

  $("#built-with > ul")
    .children("li")
    .each((i, e) => {
      tags.push($(e).find("span").text());
    });

  let githubLink: string | undefined;
  const links: string[] = [];

  $(".app-links ul")
    .children("li")
    .each((i, e) => {
      const href = $(e).find("a").attr("href");
      const urlVal = href || "";
      try {
        const parsedUrl = new URL(urlVal);
        if (parsedUrl.hostname === "github.com") {
          githubLink = urlVal;
        } else {
          links.push(urlVal);
        }
      } catch (_error) {
        console.log(`Invalid URL: ${urlVal}`);
      }
    });

  const members: TeamMember[] = [];

  $("#app-team ul")
    .children(".software-team-member")
    .each((i, e) => {
      const image = $(e).find(".user-profile-link img").attr("src") || null;
      const name = $(e).find(".user-profile-link").text() || null;
      members.push({ image, name });
    });

  return {
    id: projectID,
    title,
    tagline,
    images,
    description,
    tags,
    githubLink,
    links,
    members,
  };
};
