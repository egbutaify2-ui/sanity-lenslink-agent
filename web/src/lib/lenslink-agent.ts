import { createMCPClient } from "@ai-sdk/mcp";
import { generateText, stepCountIs, type LanguageModel } from "ai";

const knowledgeBaseId = "kbgd2ZLPDgQG";

const conversationalSystemPrompt = `You are LensLink, a camera-gear compatibility agent.

For greetings, thanks, and other simple conversational messages, respond naturally and briefly. You may explain what LensLink does and how to ask it camera-gear questions. Do not invent camera or lens facts. Compatibility and factual gear questions must be handled through the structured LensLink Knowledge Base route.`;

const knowledgeQuestionSignals = [
  /\bcompatib/i,
  /\bcamera(s)?\\b/i,
  /\blens(es)?\\b/i,
  /\bmount(s|ed|ing)?\\b/i,
  /\badapter(s)?\\b/i,
  /\beos\\b/i,
  /\brf(?:-|\\s)?\\d/i,
  /\bef(?:-|\\s)?(?:m|\\d)/i,
  /\b(?:supported|support|specification|specs|technical|knowledge base)\\b/i,
  /\b(?:work|fit|attach|use)\\b.*\\b(?:with|on|for)\\b/i,
];

export function requiresKnowledgeBase(question: string): boolean {
  return knowledgeQuestionSignals.some((signal) => signal.test(question));
}

const systemPrompt = `You are LensLink, a camera-gear compatibility agent.

Answer camera, lens, mount, adapter, and compatibility questions using the LensLink Knowledge Base through the supplied Context MCP tools. Prefer structured relationships between cameras, lenses, mounts, adapters, compatibility rules, and sources over unsupported assumptions.

Explain whether a pairing is directly compatible, requires an adapter, or is unsupported/not verified. Explain required adapters, limitations, and conditions. Preserve source and evidence information from retrieved Knowledge Base content when it is available.

Never invent compatibility facts, URLs, sources, or product capabilities. If the Knowledge Base does not contain enough evidence, say so. Do not turn an unsupported or not-verified result into a claim of proven physical impossibility.`;

export type LensLinkAgentResult = {
  text: string;
  toolCalls: unknown[];
  toolResults: unknown[];
};

function toolOutputText(output: unknown): string {
  if (typeof output === "string") return output;
  if (!output || typeof output !== "object" || !("content" in output)) return "";
  if (!Array.isArray(output.content)) return "";
  return output.content
    .map((item) =>
      typeof item === "object" && item !== null && "text" in item && typeof item.text === "string"
        ? item.text
        : "",
    )
    .join("\n");
}

function rankedKnowledgeBasePaths(searchOutput: unknown): string[] {
  const matches = toolOutputText(searchOutput).matchAll(/^\s*\d+\.\s+`([^`]+)`/gm);
  return [...new Set([...matches].map((match) => match[1]))];
}

function isToolError(output: unknown): boolean {
  return typeof output === "object" && output !== null && "isError" in output && output.isError === true;
}

export async function answerLensLinkQuestion(
  question: string,
  model: LanguageModel,
): Promise<LensLinkAgentResult> {
  if (!requiresKnowledgeBase(question)) {
    const result = await generateText({
      model,
      system: conversationalSystemPrompt,
      prompt: question,
    });

    return {
      text: result.text,
      toolCalls: [],
      toolResults: [],
    };
  }

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

    const toolCalls: { toolName: string; input: unknown }[] = [];
    const toolResults: { toolName: string; input: unknown; output: unknown }[] = [];
    const callContextTool = async (toolName: string, input: unknown) => {
      const output = await tools[toolName].execute(input, {
        toolCallId: `lenslink-prefetch-${toolCalls.length + 1}`,
        messages: [],
      });
      if (isToolError(output)) {
        throw new Error(`Context MCP ${toolName} failed during required evidence retrieval`);
      }
      toolCalls.push({ toolName, input });
      toolResults.push({ toolName, input, output });
      return output;
    };

    const initialContextInput = {};
    const initialContext = await callContextTool("initial_context", initialContextInput);
    const searchInput = { knowledgeBase: knowledgeBaseId, query: question };
    const searchResult = await callContextTool("knowledge_base_search", searchInput);
    const paths = rankedKnowledgeBasePaths(searchResult);

    if (paths.length === 0) {
      throw new Error("Context MCP search returned no readable Knowledge Base entries");
    }

    const readInput = { knowledgeBase: knowledgeBaseId, paths };
    const readResult = await callContextTool("knowledge_base_read", readInput);
    const retrievedEvidence = [initialContext, searchResult, readResult]
      .map(toolOutputText)
      .filter(Boolean)
      .join("\n\n");

    const result = await generateText({
      model,
      system: `${systemPrompt}\n\nRequired Context MCP search and Knowledge Base reads have already completed. Base compatibility conclusions on this retrieved evidence; if it does not establish the pairing, say that it is not verified.\n\n${retrievedEvidence}`,
      prompt: question,
      tools,
      stopWhen: stepCountIs(6),
    });

    return {
      text: result.text,
      toolCalls: [...toolCalls, ...result.steps.flatMap((step) => step.toolCalls)],
      toolResults: [...toolResults, ...result.steps.flatMap((step) => step.toolResults)],
    };
  } finally {
    await mcpClient.close();
  }
}

export { knowledgeBaseId, systemPrompt };
