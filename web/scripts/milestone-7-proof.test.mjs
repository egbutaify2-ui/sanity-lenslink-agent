import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { test } from "node:test";
import { answerLensLinkQuestion, knowledgeBaseId } from "../src/lib/lenslink-agent.ts";
import { createLensLinkModel } from "../src/lib/lenslink-model.ts";

const requiredTools = [
  "initial_context",
  "knowledge_base_read",
];
const availableTools = [...requiredTools, "knowledge_base_search"];

const scenarios = [
  {
    id: "rf-direct",
    question: "Is the Canon RF50mm F1.8 STM compatible with the Canon EOS R5?",
    answerPattern: /compatible|direct|native/i,
    evidencePatterns: [
      /Canon EOS R5/i,
      /Canon RF 50mm/i,
      /RF mount/i,
      /direct|native/i,
    ],
    requiredPaths: ["compatibility/canon_eos_r5", "lenses/canon_rf_primes"],
  },
  {
    id: "ef-adapter-required",
    question: "Can I use the Canon EF50mm f/1.8 STM on the Canon EOS R5?",
    answerPattern: /adapter/i,
    evidencePatterns: [
      /Canon EOS R5/i,
      /Canon EF 50mm/i,
      /From mount\s*\|\s*Canon EF/i,
      /To mount\s*\|\s*Canon RF/i,
      /Canon Mount Adapter EF-EOS R/i,
    ],
    requiredPaths: [
      "compatibility/canon_eos_r5",
      "lenses/canon_ef_primes",
      "adapters",
    ],
  },
  {
    id: "ef-m-evidence-limited",
    question: "Is the Canon EF-M 22mm f/2 STM compatible with the Canon EOS R5?",
    answerPattern: /not compatible|not supported|unsupported|not documented/i,
    evidencePatterns: [
      /Canon EOS R5/i,
      /Canon EF-M 22mm/i,
      /not compatible|not supported|unsupported|not documented/i,
    ],
    requiredPaths: ["compatibility/canon_eos_r5", "lenses/canon_ef_primes"],
    forbiddenAnswerPatterns: [
      /physically impossible/i,
      /cannot physically fit/i,
      /impossible to mount/i,
    ],
  },
];

const evidence = [];

function outputText(output) {
  if (typeof output === "string") return output;
  if (Array.isArray(output)) return output.map(outputText).join("\n");
  if (!output || typeof output !== "object") return "";
  if (Array.isArray(output.content)) {
    return output.content.map((item) => item.text ?? "").join("\n");
  }
  return JSON.stringify(output);
}

function validateScenario(scenario, record) {
  const calledTools = new Set(record.toolCalls.map(({ toolName }) => toolName));
  assert.ok(record.answer.trim(), "The agent returned an empty answer");
  for (const toolName of requiredTools) {
    assert.ok(calledTools.has(toolName), `${toolName} was not called`);
  }
  assert.match(record.answer, scenario.answerPattern, "Answer did not resolve the scenario");

  const readResults = record.toolResults.filter(
    ({ toolName, isError }) => toolName === "knowledge_base_read" && !isError,
  );
  assert.ok(readResults.length > 0, "No successful Knowledge Base read was returned");

  const readPaths = readResults.flatMap(({ input }) => input?.paths ?? []);
  for (const path of scenario.requiredPaths) {
    assert.ok(readPaths.includes(path), `Knowledge Base entry was not read: ${path}`);
  }

  const retrievedText = readResults.map(({ returnedText }) => returnedText).join("\n");
  for (const pattern of scenario.evidencePatterns) {
    assert.match(retrievedText, pattern, `Retrieved evidence was missing ${pattern}`);
  }
  for (const pattern of scenario.forbiddenAnswerPatterns ?? []) {
    assert.doesNotMatch(record.answer, pattern, `Answer made an unsupported claim: ${pattern}`);
  }
}

test("live Context MCP proof: all three scenarios", async () => {
  const validationErrors = [];

  for (const scenario of scenarios) {
    const record = {
      id: scenario.id,
      question: scenario.question,
      answer: "",
      toolCalls: [],
      toolResults: [],
      passed: false,
    };
    evidence.push(record);

    try {
      const result = await answerLensLinkQuestion(scenario.question, createLensLinkModel());
      record.answer = result.text;
      record.toolCalls = result.toolCalls.map(({ toolName, input }) => ({ toolName, input }));
      record.toolResults = result.toolResults.map((toolResult) => ({
        toolName: toolResult.toolName,
        input: toolResult.input,
        isError: toolResult.output?.isError === true,
        returnedText: outputText(toolResult.output),
      }));
      validateScenario(scenario, record);
      record.passed = true;
    } catch (error) {
      record.validationError = error.message;
      validationErrors.push(`${scenario.id}: ${error.message}`);
    }
  }

  const usedTools = [...new Set(evidence.flatMap(({ toolCalls }) => toolCalls.map(({ toolName }) => toolName)))];
  const report = {
    generatedAt: new Date().toISOString(),
    complete: evidence.length === scenarios.length && evidence.every(({ passed }) => passed),
    source: "Live LensLink agent backed by Sanity Context MCP",
    knowledgeBaseId,
    availableTools,
    requiredInvokedTools: requiredTools,
    usedTools,
    scenarios: evidence,
  };
  await writeFile(
    new URL("../milestone-7-evidence.json", import.meta.url),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  console.log(`Live proof evidence written to web/milestone-7-evidence.json`);
  assert.deepEqual(validationErrors, [], "One or more live scenarios failed validation");
});
