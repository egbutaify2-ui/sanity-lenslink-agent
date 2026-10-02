import assert from "node:assert/strict";
import { test } from "node:test";
import { parseLensLinkQuestion } from "../src/lib/lenslink-request.ts";

function createRequest(body) {
  return new Request("http://localhost/api/lenslink", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

async function assertBadRequest(body, expectedMessage) {
  const result = await parseLensLinkQuestion(createRequest(body));
  assert.ok(result instanceof Response);
  assert.equal(result.status, 400);
  assert.deepEqual(await result.json(), { error: expectedMessage });
}

test("rejects malformed JSON", async () => {
  await assertBadRequest("{", "Request body must be valid JSON");
});

test("rejects null and non-object JSON bodies", async () => {
  for (const body of ["null", "[]", "42", '"text"']) {
    await assertBadRequest(body, "Request body must be a JSON object");
  }
});

test("requires a non-empty question", async () => {
  for (const body of ["{}", '{"question":""}', '{"question":"  "}', '{"question":42}']) {
    await assertBadRequest(body, "A non-empty question is required");
  }
});

test("trims and returns a valid question", async () => {
  const result = await parseLensLinkQuestion(createRequest('{"question":"  EOS R5 lens?  "}'));
  assert.equal(result, "EOS R5 lens?");
});
