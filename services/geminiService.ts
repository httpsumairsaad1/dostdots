import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize client only when needed
const getClient = () => {
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateQuote = async (type: 'quote' | 'quran', tag: string): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    console.warn("No API Key available for Gemini.");
    return "API Key Missing: Set API_KEY env var.";
  }

  const prompt = type === 'quran'
    ? `Provide a short, inspiring Quran Ayat (in English translation only) related to "${tag}". Max 15 words. Include reference (Surah:Verse) at the end.`
    : `Provide a short, minimalist motivational quote related to "${tag}" for a developer/hacker. Max 12 words. No attribution needed.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error fetching inspiration. Stay focused.";
  }
};