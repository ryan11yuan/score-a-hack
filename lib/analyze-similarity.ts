import OpenAI from "openai";
import useBackOff from "./utils";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // string | undefined is acceptable per SDK
});

export interface SimilaritySection {
  similarityScore: number;
  scoreJustification: string;
}

export interface SimilarityResult {
  thematicFocus: SimilaritySection;
  objectiveApproach: SimilaritySection;
  targetUser: SimilaritySection;
  overallScore: SimilaritySection;
}

const generatePrompt = (description1: string, description2: string): string => `[INSTRUCTIONS]
Given two text descriptions of hackathon projects, analyze and compare them for similarity across various dimensions to aid judges in making informed decisions.

—-

[INPUT]
Project1_Description: ${description1}
Project2_Description: ${description2}

—-
[OUTPUT] Return a JSON-valid format.

{
  "thematicFocus": {
    "similarityScore": "0 to 10",
    "scoreJustification": "e.g. are the thematic focus areas the same? If so, what is the theme? If not, how are they different?"
  },
  "objectiveApproach": {
    "similarityScore": "0 to 10",
    "scoreJustification": "e.g. are the objective alignment the same? If so, what is it? If not, how are they different?"
  },
  "targetUser": {
    "similarityScore": "0 to 10",
    "scoreJustification": "e.g. are the target/end user the same? If so, who is it? If not, how are they different?"
  },
  "overallScore": {
    "similarityScore": "Average score",
    "scoreJustification": "e.g. main score justification"
  }
}`;

export const analyzeSimilarity = async (
  description1: string,
  description2: string
): Promise<SimilarityResult | string> => {
  const prompt = generatePrompt(description1, description2);

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
    // Raw parse (LLM may return scores as strings); coerce to numbers.
    const raw = JSON.parse(answer) as Record<
      string,
      { similarityScore: number | string; scoreJustification: string }
    >;

    const parsed: SimilarityResult = Object.entries(raw).reduce(
      (acc, [key, value]) => {
        const numeric =
          typeof value.similarityScore === "number"
            ? value.similarityScore
            : parseFloat(String(value.similarityScore));

        return {
          ...acc,
          [key]: {
            similarityScore: Number.isFinite(numeric) ? numeric : 0,
            scoreJustification: value.scoreJustification ?? "",
          },
        } as SimilarityResult;
      },
      {} as SimilarityResult
    );

    // Compute overallScore as the average of the three main dimensions (exclude overall if present).
    const dims: Array<keyof SimilarityResult> = [
      "thematicFocus",
      "objectiveApproach",
      "targetUser",
    ];

    const avg =
      dims.reduce(
        (sum, key) => sum + (parsed?.[key]?.similarityScore ?? 0),
        0
      ) / dims.length;

    // Match original behavior: truncate via parseInt base 10
    parsed.overallScore = {
      similarityScore: parseInt(String(avg), 10),
      scoreJustification:
        parsed.overallScore?.scoreJustification ?? raw?.overallScore?.scoreJustification ?? "",
    };

    console.log("PARSED_SIMILARITY", parsed);
    return parsed;
  } catch (err) {
    console.error("JSON_PARSE_ERROR", err);
    // Fall back to returning the raw string if parsing failed
    return answer;
  }
};

export default analyzeSimilarity;