import OpenAI from "openai";
import useBackOff from "./utils";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // string | undefined is fine per SDK
});

export interface ProjectAnalysis {
  shortDescription: string;
  thematicFocus: string;
  objectiveApproach: string;
  targetUser: string;
}

const generatePrompt = (description: string): string => `Given a text description of a hackathon project, analyze its Thematic Focus, Objective Approach, and Target User to provide insights for judges.

Input:
Project_Description: ${description}

Output (should be a valid JSON):
{
  "shortDescription": "[One-sentence description of the project]",
  "thematicFocus": "[Short summary describing the thematic focus of the project.]",
  "objectiveApproach": "[Short summary stating the objectives of the technology developed in the project.]",
  "targetUser": "[Short summary describing who the target or end user of the project is.]"
}`;

export const generateDescription = async (
  description: string
): Promise<ProjectAnalysis | string> => {
  const prompt = generatePrompt(description);

  const answer = await useBackOff(() =>
    openai.chat.completions
      .create({
        model: "gpt-3.5-turbo-16k",
        temperature: 0,
        messages: [{ role: "user", content: prompt }],
      })
      .catch((err: unknown) => {
        console.error("OPEN_AI_ERROR", err);
        throw err;
      })
  ).then((r) => r.choices[0]?.message?.content ?? "");

  console.log(answer);

  try {
    // Attempt to parse into our expected shape
    const parsed = JSON.parse(answer) as ProjectAnalysis;
    return parsed;
  } catch (err) {
    console.error("JSON_PARSE_ERROR", err);
    // Fall back to returning the raw string if parsing failed
    return answer;
  }
};

export default generateDescription;