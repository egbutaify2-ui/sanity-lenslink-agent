export type KnowledgeEntry = {
  path: string;
  text: string;
};

export type EvidenceState =
  | {
      kind: "documented-compatible";
      compatibility: "direct" | "adapter";
      path: string;
    }
  | {
      kind: "documented-incompatible";
      path: string;
    }
  | {
      kind: "unknown";
      missing: Array<"compatibility-rule" | "supporting-source">;
    };

const directSignals = /\b(?:direct(?:ly)? compatible|native(?:ly)? compatible|direct,?\s+no adapter)\b/i;
const adapterSignals = /\b(?:requires?|needs?)\b[^\n.]{0,120}\badapter\b/i;
const incompatibleSignals = /\b(?:not compatible|incompatible|not supported)\b/i;
const sourceHeader = /(?:^|\n)##\s+Sources\s*\n/i;

function normalizeCompact(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function extractCompatibilityPair(question: string): { left: string; right: string } | null {
  const patterns = [
    /(?:is|are)\s+(.+?)\s+compatible with\s+(.+?)[?.!]?$/i,
    /(?:can|could|would|will)\s+(?:i|you)\s+use\s+(.+?)\s+(?:on|with)\s+(.+?)[?.!]?$/i,
    /(?:does|do)\s+(.+?)\s+(?:work|fit)\s+(?:with|on)\s+(.+?)[?.!]?$/i,
  ];

  for (const pattern of patterns) {
    const match = question.trim().match(pattern);
    if (match?.[1] && match[2]) {
      return {
        left: match[1].trim().replace(/^the\s+/i, ""),
        right: match[2].trim().replace(/^the\s+/i, ""),
      };
    }
  }

  return null;
}

function candidateEntityPair(question: string): { camera: string; lens: string } | null {
  const pair = extractCompatibilityPair(question);
  if (!pair) return null;

  const looksLikeLens = (value: string) => /\b(?:mm|stm|lens|rf|ef(?:-m)?|f\/?\d)/i.test(value);
  const looksLikeCamera = (value: string) => /\b(?:eos|camera|r\d|body)/i.test(value);

  if (looksLikeLens(pair.left) && looksLikeCamera(pair.right)) {
    return { lens: pair.left, camera: pair.right };
  }
  if (looksLikeCamera(pair.left) && looksLikeLens(pair.right)) {
    return { camera: pair.left, lens: pair.right };
  }
  return { camera: pair.right, lens: pair.left };
}

export function isCompatibilityQuestion(question: string): boolean {
  return /\bcompatib/i.test(question)
    || /\b(?:can|could|would|will)\s+(?:i|you)\s+use\b.*\b(?:on|with)\b/i.test(question)
    || /\b(?:work|fit|attach)\b.*\b(?:on|with)\b/i.test(question);
}

function hasSupportingSource(text: string): boolean {
  const sourceIndex = text.search(sourceHeader);
  if (sourceIndex < 0) return false;
  const sourceSection = text.slice(sourceIndex);
  return /\n\s*\d+\.\s+\S+/.test(sourceSection);
}

export function knowledgeEntriesFromReadResult(paths: string[], readText: string): KnowledgeEntry[] {
  const segments = readText.split(/\n\n---\n\n/);
  return paths
    .map((path, index) => ({ path, text: segments[index] ?? "" }))
    .filter((entry) => entry.text.trim().length > 0);
}

export function classifyCompatibilityEvidence(
  question: string,
  entries: KnowledgeEntry[],
): EvidenceState {
  const compatibilityEntries = entries.filter((entry) => entry.path.startsWith("compatibility/"));
  const pair = candidateEntityPair(question);

  if (!pair) {
    return { kind: "unknown", missing: ["compatibility-rule"] };
  }

  const matchingEntry = compatibilityEntries.find((entry) => {
    const compact = normalizeCompact(entry.text);
    return compact.includes(normalizeCompact(pair.camera)) && compact.includes(normalizeCompact(pair.lens));
  });

  if (!matchingEntry) {
    return { kind: "unknown", missing: ["compatibility-rule", "supporting-source"] };
  }

  const relevantLens = pair?.lens ? normalizeCompact(pair.lens) : null;
  const lines = matchingEntry.text.split(/\r?\n/);
  const relevantLines = relevantLens
    ? lines.filter((line) => normalizeCompact(line).includes(relevantLens))
    : lines;
  const stateLine = relevantLines.find(
    (line) => incompatibleSignals.test(line) || adapterSignals.test(line) || directSignals.test(line),
  ) ?? "";

  let kind: EvidenceState["kind"] | null = null;
  let compatibility: "direct" | "adapter" | undefined;
  if (incompatibleSignals.test(stateLine)) {
    kind = "documented-incompatible";
  } else if (adapterSignals.test(stateLine)) {
    kind = "documented-compatible";
    compatibility = "adapter";
  } else if (directSignals.test(stateLine)) {
    kind = "documented-compatible";
    compatibility = "direct";
  }

  if (!kind) {
    return { kind: "unknown", missing: ["compatibility-rule"] };
  }

  if (!hasSupportingSource(matchingEntry.text)) {
    return { kind: "unknown", missing: ["supporting-source"] };
  }

  return compatibility && kind === "documented-compatible"
    ? { kind, compatibility, path: matchingEntry.path }
    : { kind: "documented-incompatible", path: matchingEntry.path };
}

export function evidenceLimitedResponse(
  state: Extract<EvidenceState, { kind: "unknown" }>,
): string {
  const missingRule = state.missing.includes("compatibility-rule");
  const missingSource = state.missing.includes("supporting-source");

  if (missingRule && missingSource) {
    return "The relevant camera and lens records are present, but the compatibility result is unknown/evidence-limited. I did not retrieve a documented compatibility rule with supporting source evidence for this exact pairing.";
  }

  if (missingSource) {
    return "The compatibility result is unknown/evidence-limited because the retrieved compatibility rule does not include supporting source evidence for this exact pairing.";
  }

  return "The compatibility result is unknown/evidence-limited because the retrieved compatibility evidence does not explicitly establish the pairing.";
}
