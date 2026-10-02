import { answerLensLinkQuestion } from "@/lib/lenslink-agent";
import { createLensLinkModel } from "@/lib/lenslink-model";
import { parseLensLinkQuestion } from "@/lib/lenslink-request";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const parsedQuestion = await parseLensLinkQuestion(request);
  if (parsedQuestion instanceof Response) return parsedQuestion;

  try {
    const result = await answerLensLinkQuestion(
      parsedQuestion,
      createLensLinkModel(),
    );

    if (!result.text.trim()) {
      return Response.json(
        { error: "LensLink agent request failed" },
        { status: 502 },
      );
    }

    return Response.json({
      answer: result.text,
      toolCalls: result.toolCalls.map((toolCall) => ({
        toolName:
          typeof toolCall === "object" && toolCall !== null && "toolName" in toolCall
            ? toolCall.toolName
            : "unknown",
      })),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "GOOGLE_GENERATIVE_AI_API_KEY is not configured") {
      return Response.json(
        { error: "Google Gemini provider is not configured for LensLink" },
        { status: 503 },
      );
    }

    return Response.json(
      { error: "LensLink agent request failed" },
      { status: 502 },
    );
  }
}
