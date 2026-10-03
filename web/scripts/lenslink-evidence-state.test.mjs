import assert from "node:assert/strict";
import { test } from "node:test";
import {
  classifyCompatibilityEvidence,
  evidenceLimitedResponse,
} from "../src/lib/lenslink-evidence.ts";

const camera = {
  path: "cameras",
  text: "Canon EOS R5 | Native mount | Canon RF",
};
const efLens = {
  path: "lenses/canon_ef_primes",
  text: "Canon EF 50mm f/1.8 STM | Mount | Canon EF",
};
const efAdapter = {
  path: "adapters",
  text: "Canon Mount Adapter EF-EOS R | From mount | Canon EF | To mount | Canon RF",
};
const rfLens = {
  path: "lenses/canon_rf_primes",
  text: "Canon RF 50mm f/1.8 STM | Native mount | Canon RF",
};
const efmLens = {
  path: "lenses/canon_ef_primes",
  text: "Canon EF-M 22mm f/2 STM | Mount | Canon EF-M",
};

const adapterRule = {
  path: "compatibility/canon_eos_r5_ef50",
  text: `# Canon EOS R5 + Canon EF 50mm f/1.8 STM\n\n**Example:** Canon EF 50mm f/1.8 STM — requires Canon Mount Adapter EF-EOS R.\n\n## Sources\n\n1. Canon EOS R5 + Canon EF 50mm f/1.8 STM — Adapter Required`,
};
const directRule = {
  path: "compatibility/canon_eos_r5_rf50",
  text: `# Canon EOS R5 + Canon RF 50mm f/1.8 STM\n\n**Example:** Canon RF 50mm f/1.8 STM — direct, no adapter needed.\n\n## Sources\n\n1. Canon EOS R5 + Canon RF 50mm f/1.8 STM — Direct Compatibility`,
};
const incompatibleRule = {
  path: "compatibility/canon_eos_r5_efm22",
  text: `# Canon EOS R5 + Canon EF-M 22mm f/2 STM\n\n**Example:** Canon EF-M 22mm f/2 STM — incompatible with EOS R5.\n\n## Sources\n\n1. Canon EOS R5 + Canon EF-M 22mm f/2 STM — Not Compatible`,
};
const noSourceRule = {
  ...adapterRule,
  text: adapterRule.text.replace(/\n## Sources[\s\S]*/i, ""),
};

test("entity-only evidence stays unknown when compatibility support is missing", () => {
  const state = classifyCompatibilityEvidence(
    "Can I use the Canon EF 50mm f/1.8 STM on the Canon EOS R5?",
    [camera, efLens, efAdapter],
  );

  assert.deepEqual(state, {
    kind: "unknown",
    missing: ["compatibility-rule", "supporting-source"],
  });

  const response = evidenceLimitedResponse(state);
  assert.match(response, /compatibility result is unknown\/evidence-limited/i);
  assert.match(response, /documented compatibility rule with supporting source evidence/i);
  assert.doesNotMatch(response, /confidently|physically impossible/i);
});

test("a compatibility rule without supporting source remains evidence-limited", () => {
  const state = classifyCompatibilityEvidence(
    "Can I use the Canon EF 50mm f/1.8 STM on the Canon EOS R5?",
    [camera, efLens, efAdapter, noSourceRule],
  );

  assert.deepEqual(state, {
    kind: "unknown",
    missing: ["supporting-source"],
  });
});

test("explicit source-backed adapter rule is documented compatible", () => {
  const state = classifyCompatibilityEvidence(
    "Can I use the Canon EF 50mm f/1.8 STM on the Canon EOS R5?",
    [camera, efLens, efAdapter, adapterRule],
  );

  assert.deepEqual(state, {
    kind: "documented-compatible",
    compatibility: "adapter",
    path: "compatibility/canon_eos_r5_ef50",
  });
});

test("explicit source-backed direct rule is documented compatible", () => {
  const state = classifyCompatibilityEvidence(
    "Is the Canon RF 50mm f/1.8 STM compatible with the Canon EOS R5?",
    [camera, rfLens, directRule],
  );

  assert.deepEqual(state, {
    kind: "documented-compatible",
    compatibility: "direct",
    path: "compatibility/canon_eos_r5_rf50",
  });
});

test("explicit source-backed negative rule is documented incompatible", () => {
  const state = classifyCompatibilityEvidence(
    "Is the Canon EF-M 22mm f/2 STM compatible with the Canon EOS R5?",
    [camera, efmLens, incompatibleRule],
  );

  assert.deepEqual(state, {
    kind: "documented-incompatible",
    path: "compatibility/canon_eos_r5_efm22",
  });
});
