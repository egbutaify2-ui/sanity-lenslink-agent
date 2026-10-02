export async function parseLensLinkQuestion(request: Request): Promise<string | Response> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "Request body must be a JSON object" }, { status: 400 });
  }

  const question = "question" in body ? body.question : undefined;
  if (typeof question !== "string" || question.trim().length === 0) {
    return Response.json({ error: "A non-empty question is required" }, { status: 400 });
  }

  return question.trim();
}
