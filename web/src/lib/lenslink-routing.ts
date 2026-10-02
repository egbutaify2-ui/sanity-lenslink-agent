const knowledgeQuestionSignals = [
  /\bcompatib/i,
  /\bcamera(s)?\b/i,
  /\blens(es)?\b/i,
  /\bmount(s|ed|ing)?\b/i,
  /\badapter(s)?\b/i,
  /\beos\b/i,
  /\brf(?:-|\s)?\d/i,
  /\bef(?:-|\s)?(?:m|\d)/i,
  /\b(?:supported|support|specification|specs|technical|knowledge base)\b/i,
  /\b(?:work|fit|attach|use)\b.*\b(?:with|on|for)\b/i,
];

export function requiresKnowledgeBase(question: string): boolean {
  return knowledgeQuestionSignals.some((signal) => signal.test(question));
}
