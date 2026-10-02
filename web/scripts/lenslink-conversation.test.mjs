import assert from "node:assert/strict";
import { test } from "node:test";
import { requiresKnowledgeBase } from "../src/lib/lenslink-routing.ts";

function appendConversation(entries, entry) {
  return [...entries, entry];
}

function updateConversation(entries, id, update) {
  return entries.map((entry) => (entry.id === id ? { ...entry, ...update } : entry));
}

test("conversation history appends and preserves the first answer", () => {
  let conversation = [];
  conversation = appendConversation(conversation, {
    id: "one",
    question: "Is the RF50mm compatible with the EOS R5?",
    status: "success",
    answer: "Yes, the RF50mm is directly compatible.",
  });
  conversation = appendConversation(conversation, {
    id: "two",
    question: "Can I use the EF50mm on the EOS R5?",
    status: "loading",
  });
  conversation = updateConversation(conversation, "two", {
    status: "success",
    answer: "Yes, with the Canon Mount Adapter EF-EOS R.",
  });

  assert.equal(conversation.length, 2);
  assert.equal(conversation[0].question, "Is the RF50mm compatible with the EOS R5?");
  assert.equal(conversation[0].answer, "Yes, the RF50mm is directly compatible.");
  assert.equal(conversation[1].question, "Can I use the EF50mm on the EOS R5?");
  assert.equal(conversation[1].answer, "Yes, with the Canon Mount Adapter EF-EOS R.");
});

test("simple conversational input bypasses Knowledge Base routing", () => {
  assert.equal(requiresKnowledgeBase("Thank you"), false);
  assert.equal(requiresKnowledgeBase("Hello"), false);
  assert.equal(requiresKnowledgeBase("What can you help me with?"), false);
});

test("LensLink knowledge questions retain Knowledge Base routing", () => {
  assert.equal(requiresKnowledgeBase("What cameras and lenses are supported?"), true);
  assert.equal(
    requiresKnowledgeBase("Is the Canon RF50mm F1.8 STM compatible with the Canon EOS R5?"),
    true,
  );
  assert.equal(
    requiresKnowledgeBase("Can I use the Canon EF50mm f/1.8 STM on the Canon EOS R5?"),
    true,
  );
});
