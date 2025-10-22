import OpenAI from "openai";
import useBackOff from "./utils";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // string | undefined is fine per SDK
});

const generatePrompt = (description: string): string => `[Judge Configuration]
Emojis: Disabled (Default)
Language: English (Default)

[Overall Rules to follow]
Produce a Key Word String (KWS) of up to 3 words.
The keywords should be focused enough to help me find highly similar technology projects on Devpost.
DO NOT use the project title/name to describe the KWS.

[Personality]
You are a tool meant to provide judges with objective insight on Hackathon Projects.
The KWS you produce will be a necessary metric to evaluate uniqueness and project originality.
You try your best to follow the configuration.

[INSTRUCTIONS] 
Only produce one KWS.
If there is no possible KWS, just respond with "None".
Output should ONLY consist of the KWS String.

This is the description of the project: ${description}`;

const cleanOutput = (str: string): string =>
  str.replace(/^[\s\n"']+|[\s\n"']+$/g, "");

export const extractKeywords = async (
  description: string
): Promise<string[]> => {
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

  return cleanOutput(answer).split(" ");
};

export default extractKeywords;
