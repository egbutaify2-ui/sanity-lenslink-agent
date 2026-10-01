import { createMCPClient } from "@ai-sdk/mcp";
import { generateText, stepCountIs, type LanguageModel } from "ai";

const knowledgeBaseId = "kbgd2ZLPDgQG";

const systemPrompt = `You are LensLink, a camera-gear compatibility agent.

Answer camera, lens, mount, adapter, and compatibility questions using the LensLink Knowledge Base through the supplied Context MCP tools. Prefer structured relationships between cameras, lenses, mounts, adapters, compatibility rules, and sources over unsupported assumptions.

Explain whether a pairing is directly compatible, requires an adapter, or is unsupported/not verified. Explain required adapters, limitations, and conditions. Preserve source and evidence information from retrieved Knowledge Base content when it is available.

Never invent compatibility facts, URLs, sources, or product capabilities. If the Knowledge Base does not contain enough evidence, say so. Do not turn an unsupported or not-verified result into a claim of proven physical impossibility.`;

export type LensLinkAgentResult = {
  text: string;
  toolCalls: unknown[];
  toolResults: unknown[];
};

export async function answerLensLinkQuestion(
  question: string,
  model: LanguageModel,
): Promise<LensLinkAgentResult> {
  const endpoint = process.env.SANITY_CONTEXT_MCP_URL;
  const token = process.env.SANITY_ORGANIZATION_TOKEN;

  if (!endpoint || !token) {
    throw new Error("Sanity Context MCP environment is not configured");
  }

  const mcpClient = await createMCPClient({
    transport: {
      type: "http",
      url: endpoint,
      headers: { Authorization: `Bearer ${token}` },
    },
  });

  try {
    const tools = await mcpClient.tools();
    const requiredTools = [
      "initial_context",
      "knowledge_base_read",
      "knowledge_base_search",
    ];
    const missingTools = requiredTools.filter((toolName) => !(toolName in tools));

    if (missingTools.length > 0) {
      throw new Error(`Required Context MCP tools are unavailable: ${missingTools.join(", ")}`);
    }

    const result = await generateText({
      model,
      system: systemPrompt,
      prompt: question,
      tools,
      stopWhen: stepCountIs(6),
    });

    return {
      text: result.text,
      toolCalls: result.steps.flatMap((step) => step.toolCalls),
      toolResults: result.steps.flatMap((step) => step.toolResults),
    };
  } finally {
    await mcpClient.close();
  }
}

export { knowledgeBaseId, systemPrompt };
