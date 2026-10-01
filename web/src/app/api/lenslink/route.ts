import { answerLensLinkQuestion } from "@/lib/lenslink-agent";
import { createLensLinkModel } from "@/lib/lenslink-model";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { question?: unknown };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  if (typeof body.question !== "string" || body.question.trim().length === 0) {
    return Response.json({ error: "A non-empty question is required" }, { status: 400 });
  }

  try {
    const result = await answerLensLinkQuestion(
      body.question.trim(),
      createLensLinkModel(),
    );

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
