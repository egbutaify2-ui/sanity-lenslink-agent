"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";

const exampleQuestions = [
  "Will the Canon RF50mm F1.8 STM work with the EOS R5?",
  "Can I use the Canon EF 50mm f/1.8 STM on the EOS R5?",
  "Why isn't the Canon EF-M 22mm supported on the EOS R5?",
];

type AnswerBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] };

type LensLinkResponse = {
  answer?: unknown;
  toolCalls?: unknown;
};

function parseAnswer(answer: string): AnswerBlock[] {
  const blocks: AnswerBlock[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];

  function flushParagraph() {
    if (paragraph.length > 0) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    }
  }

  function flushList() {
    if (listItems.length > 0) {
      blocks.push({ type: "list", items: listItems });
      listItems = [];
    }
  }

  for (const rawLine of answer.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = line.match(/^#{1,3}\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", text: heading[1] });
      continue;
    }

    const listItem = line.match(/^(?:[-*]|\d+[.)])\s+(.+)$/);
    if (listItem) {
      flushParagraph();
      listItems.push(listItem[1]);
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function renderInlineText(text: string) {
  const tokens = text.split(
    /(\*\*.+?\*\*|\*[^*\n]+\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)\s]+\)|https?:\/\/[^\s]+)/g,
  );

  return tokens.map((token, index) => {
    const markdownLink = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
    if (markdownLink && isHttpUrl(markdownLink[2])) {
      return (
        <a href={markdownLink[2]} key={index} rel="noreferrer" target="_blank">
          {markdownLink[1]}
        </a>
      );
    }

    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={index}>{token.slice(2, -2)}</strong>;
    }

    if (token.startsWith("*") && token.endsWith("*")) {
      return <em key={index}>{token.slice(1, -1)}</em>;
    }

    if (token.startsWith("`") && token.endsWith("`")) {
      return <code key={index}>{token.slice(1, -1)}</code>;
    }

    if (token.startsWith("http://") || token.startsWith("https://")) {
      const trailingPunctuation = token.match(/[.,!?;:]+$/)?.[0] ?? "";
      const href = token.slice(0, token.length - trailingPunctuation.length);
      if (isHttpUrl(href)) {
        return (
          <span key={index}>
            <a href={href} rel="noreferrer" target="_blank">
              {href}
            </a>
            {trailingPunctuation}
          </span>
        );
      }
    }

    return token;
  });
}

function renderAnswerBlock(block: AnswerBlock, index: number) {
  if (block.type === "heading") {
    return <h3 key={index}>{renderInlineText(block.text)}</h3>;
  }

  if (block.type === "list") {
    return (
      <ul key={index}>
        {block.items.map((item, itemIndex) => (
          <li key={itemIndex}>{renderInlineText(item)}</li>
        ))}
      </ul>
    );
  }

  return <p key={index}>{renderInlineText(block.text)}</p>;
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [toolNames, setToolNames] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  const isLoading = status === "loading";
  const answerBlocks = status === "success" ? parseAnswer(answer) : [];

  async function checkQuestion(nextQuestion: string) {
    const trimmedQuestion = nextQuestion.trim();
    setQuestion(nextQuestion);

    if (!trimmedQuestion) {
      setAnswer("");
      setToolNames([]);
      setErrorMessage("Enter a camera and lens to check compatibility.");
      setStatus("error");
      return;
    }

    setAnswer("");
    setToolNames([]);
    setErrorMessage("");
    setStatus("loading");

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 120_000);

    try {
      const response = await fetch("/api/lenslink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmedQuestion }),
        signal: controller.signal,
      });
      const payload = (await response.json().catch(() => null)) as LensLinkResponse | null;

      if (!response.ok) {
        setErrorMessage(
          response.status === 503
            ? "LensLink's model provider is not configured right now."
            : response.status === 400
              ? "Please enter a camera and lens question."
              : "LensLink couldn't complete this check. Please try again in a moment.",
        );
        setStatus("error");
        return;
      }

      if (!payload || typeof payload.answer !== "string" || !payload.answer.trim()) {
        setErrorMessage("LensLink returned no answer. Please try the check again.");
        setStatus("error");
        return;
      }

      const returnedTools = Array.isArray(payload.toolCalls)
        ? payload.toolCalls.flatMap((toolCall) => {
            if (
              typeof toolCall === "object" &&
              toolCall !== null &&
              "toolName" in toolCall &&
              typeof toolCall.toolName === "string"
            ) {
              return [toolCall.toolName];
            }
            return [];
          })
        : [];

      setAnswer(payload.answer);
      setToolNames([...new Set(returnedTools)]);
      setStatus("success");
    } catch {
      setErrorMessage(
        controller.signal.aborted
          ? "This check took longer than expected. Please try again."
          : "LensLink couldn't connect. Check your connection and try again.",
      );
      setStatus("error");
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void checkQuestion(question);
  }

  function handleQuestionKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void checkQuestion(question);
    }
  }

  return (
    <main className="site-shell">
      <header className="site-header">
        <a aria-label="LensLink home" className="wordmark" href="/">
          <span aria-hidden="true" className="wordmark-mark">L</span>
          <span>LensLink</span>
        </a>
        <span className="header-caption">Camera gear compatibility</span>
      </header>

      <div className="page-content">
        <section aria-labelledby="page-title" className="hero">
          <div>
            <p className="eyebrow"><span aria-hidden="true" /> Lens and camera, checked together</p>
            <h1 id="page-title">Check camera<br />compatibility.</h1>
            <p className="hero-description">
              Camera gear compatibility, grounded in real technical evidence.
            </p>
          </div>
          <p className="hero-note">
            Know what fits, what needs an adapter, and what the evidence supports.
          </p>
        </section>

        <div className="question-layout">
          <section aria-labelledby="question-title" className="question-panel">
            <div className="section-heading">
              <span className="section-index">01</span>
              <div>
                <p className="section-kicker">Compatibility check</p>
                <h2 id="question-title">What are you pairing?</h2>
              </div>
            </div>

            <form className="question-form" onSubmit={handleSubmit}>
              <label htmlFor="gear-question">Your camera and lens</label>
              <textarea
                autoComplete="off"
                id="gear-question"
                name="question"
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={handleQuestionKeyDown}
                placeholder="Will the Canon EF 50mm f/1.8 STM work with my EOS R5?"
                value={question}
                disabled={isLoading}
                rows={3}
              />
              {status === "error" && (
                <p className="form-error" role="alert">{errorMessage}</p>
              )}
              <div className="submit-row">
                <span className="form-note">Answers are checked against LensLink's technical knowledge.</span>
                <button className="submit-button" disabled={isLoading} type="submit">
                  <span>{isLoading ? "Checking..." : "Check compatibility"}</span>
                  <span aria-hidden="true" className="button-arrow">&#8599;</span>
                </button>
              </div>
            </form>
          </section>

          <aside aria-labelledby="examples-title" className="examples-panel">
            <p className="section-kicker">Try a real setup</p>
            <h2 id="examples-title">Start with an example</h2>
            <div className="example-list">
              {exampleQuestions.map((example, index) => (
                <button
                  className="example-button"
                  disabled={isLoading}
                  key={example}
                  onClick={() => void checkQuestion(example)}
                  type="button"
                >
                  <span className="example-index">0{index + 1}</span>
                  <span>{example}</span>
                  <span aria-hidden="true" className="example-arrow">&#8594;</span>
                </button>
              ))}
            </div>
          </aside>
        </div>

        {isLoading && (
          <div aria-live="polite" className="loading-state" role="status">
            <span aria-hidden="true" className="loading-indicator" />
            <span>Checking camera and lens compatibility...</span>
          </div>
        )}

        {status === "success" && (
          <section aria-labelledby="result-title" aria-live="polite" className="result-panel">
            <div className="result-heading">
              <div>
                <p className="section-kicker">LensLink response</p>
                <h2 id="result-title">Compatibility result</h2>
              </div>
              <span className="result-question">{question}</span>
            </div>

            {answerBlocks.length > 0 && (
              <>
                <div className="result-assessment">
                  <p className="result-label">Assessment</p>
                  <div className="answer-copy">
                    {renderAnswerBlock(answerBlocks[0], 0)}
                  </div>
                </div>

                {answerBlocks.length > 1 && (
                  <div className="result-details">
                    <h3>Reasoning and evidence</h3>
                    <div className="answer-copy">
                      {answerBlocks.slice(1).map(renderAnswerBlock)}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="retrieval-details">
              <h3>Knowledge Base retrieval</h3>
              {toolNames.length > 0 ? (
                <ul aria-label="Context MCP tools used" className="tool-list">
                  {toolNames.map((toolName) => <li key={toolName}>{toolName}</li>)}
                </ul>
              ) : (
                <p>Retrieval activity was not included with this response.</p>
              )}
            </div>
          </section>
        )}

        <footer className="site-footer">
          <span>LensLink</span>
          <span>Camera compatibility, with the evidence in view.</span>
        </footer>
      </div>
    </main>
  );
}
