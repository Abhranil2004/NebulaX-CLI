// services/gemini.mjs
import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-2.5-flash";

let client;

/**
 * Lazily initialize Gemini client using GOOGLE_API_KEY from env.
 */
function getClient() {
  if (!client) {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not set in environment.");
    }
    client = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
  }
  return client;
}

/**
 * Call Gemini with ADK-style contents + system instruction.
 * @param {Array} contents - array of {role, parts:[{text}]}
 * @param {string} systemInstruction - system prompt for identity / behavior
 * @returns {Promise<string>} - model text response
 */
export async function callGemini(contents, systemInstruction) {
  const ai = getClient();

  const result = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: {
      systemInstruction,
      temperature: 0.25,
    },
  });

  return result.text?.trim() || "";
}
