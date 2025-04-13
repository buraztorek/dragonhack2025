import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("APIKEY");

export const getGeminiResponse = async (userPrompt: string): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

  const prompt = `
Act like a chill skate coach. Keep it short and casual.
Use friendly skater lingo. Here's what I need help with:

"${userPrompt}"
`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 150,
      topK: 32,
      topP: 0.95,
    },
  });

  const response = result.response;
  return response.text().trim();
};
