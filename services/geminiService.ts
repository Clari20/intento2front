
import { GoogleGenAI } from "@google/genai";
import { Item } from "../types";

export async function getAIInsights(items: Item[]) {
  // Use exclusively process.env.API_KEY
  if (!process.env.API_KEY) {
    throw new Error("Gemini API Key is missing");
  }

  // Always use the named parameter apiKey for initialization
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Selecting gemini-3-flash-preview for general text analysis tasks
  const model = 'gemini-3-flash-preview';

  const itemsSummary = items.map(i => `- ${i.title} (${i.category}): ${i.description}`).join('\n');

  // Updated prompt to be relevant to technology hardware and TechStore theme
  const prompt = `
    Analyze the following list of tech products from a technology store inventory and provide:
    1. A brief summary of the available product range.
    2. Identification of potential inventory gaps or popular tech trends to watch.
    3. Three actionable recommendations to increase store engagement or optimize stock.
    
    Items:
    ${itemsSummary}
    
    Respond in professional markdown format.
  `;

  try {
    // Correctly call generateContent with model and contents as properties
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    // Access .text property directly from response
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate AI insights. Please check your API key and connection.";
  }
}
