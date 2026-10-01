import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { LanguageModel } from "ai";

const modelName = "gemini-3.5-flash-lite";

export function createLensLinkModel(): LanguageModel {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not configured");
  }

  const google = createGoogleGenerativeAI({ apiKey });
  return google(modelName);
}
