"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";

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

/* ---------- Presentation-only components (no logic) ---------- */

function LensLinkMark({ id, size = 32 }: { id: string; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height={size}
      viewBox="0 0 48 48"
      width={size}
    >
      <defs>
        <linearGradient id={`${id}-core`} x1="12" x2="36" y1="10" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#9d8cff" />
          <stop offset="0.55" stopColor="#6d5efc" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
        <radialGradient id={`${id}-shine`} cx="0.3" cy="0.25" r="0.7">
          <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect fill="#141418" height="48" rx="13" width="48" />
      <circle cx="24" cy="24" fill="none" r="15.5" stroke="#fff" strokeOpacity="0.9" strokeWidth="2" />
      <circle cx="24" cy="24" fill={`url(#${id}-core)`} r="10" />
      <circle cx="24" cy="24" fill={`url(#${id}-shine)`} r="10" />
      <path
        d="M24 14.5l4.2 7.3M33.5 24l-8.4 0.1M28.6 32.4l-4.2-7.3M19.4 32.6l4.2-7.2M14.5 24l8.4-0.2M19.6 15.6l4.1 7.2"
        stroke="#fff"
        strokeLinecap="round"
        strokeOpacity="0.55"
        strokeWidth="1.2"
      />
      <circle cx="24" cy="24" fill="#141418" r="2.6" />
      <circle cx="35.5" cy="12.5" fill="#8ee0c4" r="2.4" />
    </svg>
  );
}

function IconCamera() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <path d="M4 8.5A2.5 2.5 0 016.5 6h1.2l1-1.5h6.6l1 1.5h1.2A2.5 2.5 0 0120 8.5v8a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 16.5v-8z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" />
      <circle cx="12" cy="12.5" r="3.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
      <path d="M14 10a4 4 0 00-5.7 0l-3 3A4 4 0 0011 18.7l1-1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}

function IconHelp() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9.6 9.7a2.5 2.5 0 114 2c-.9.6-1.6 1.1-1.6 2.1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
      <circle cx="12" cy="16.6" fill="currentColor" r="0.9" />
    </svg>
  );
}

function IconArrowUp() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
      <path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 24 24" width="14">
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function IconDatabase() {
  return (
    <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 24 24" width="15">
      <ellipse cx="12" cy="6" rx="7" ry="2.8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 6v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6M5 12v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

const exampleIcons = [IconCamera, IconLink, IconHelp];

export default function Home() {
  type ConversationEntry = {
    id: string;
    question: string;
    status: "loading" | "success" | "error";
    answer?: string;
    toolNames: string[];
    errorMessage?: string;
  };

  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [formError, setFormError] = useState("");

  const activeMessage = conversation[conversation.length - 1];
  const isLoading = activeMessage?.status === "loading";
  const hasThread = conversation.length > 0;

  const latestTurnRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (conversation.length === 0) return;

    const frameId = window.requestAnimationFrame(() => {
      latestTurnRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [conversation.length]);

  function updateConversationEntry(id: string, update: Partial<ConversationEntry>) {
    setConversation((entries) =>
      entries.map((entry) => (entry.id === id ? { ...entry, ...update } : entry)),
    );
  }

  async function checkQuestion(nextQuestion: string) {
    const trimmedQuestion = nextQuestion.trim();

    if (!trimmedQuestion) {
      setFormError("Enter a camera and lens question, or ask LensLink something else.");
      return;
    }

    setFormError("");
    setQuestion("");

    const id = crypto.randomUUID();
    setConversation((entries) => [
      ...entries,
      {
        id,
        question: trimmedQuestion,
        status: "loading",
        toolNames: [],
      },
    ]);

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
        updateConversationEntry(id, {
          status: "error",
          errorMessage:
            response.status === 503
              ? "LensLink's model provider is not configured right now."
              : response.status === 400
                ? "Please enter a camera and lens question."
                : "LensLink couldn't complete this check. Please try again in a moment.",
        });
        return;
      }

      if (!payload || typeof payload.answer !== "string" || !payload.answer.trim()) {
        updateConversationEntry(id, {
          status: "error",
          errorMessage: "LensLink returned no answer. Please try the check again.",
        });
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

      updateConversationEntry(id, {
        status: "success",
        answer: payload.answer,
        toolNames: [...new Set(returnedTools)],
      });
    } catch {
      updateConversationEntry(id, {
        status: "error",
        errorMessage: controller.signal.aborted
          ? "This check took longer than expected. Please try again."
          : "LensLink couldn't connect. Check your connection and try again.",
      });
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

  const composer = (
    <form className="composer" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="gear-question">
        Your camera and lens
      </label>
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
      {formError && (
        <p className="form-error" role="alert">{formError}</p>
      )}
      <div className="composer-bar">
        <span className="form-note">
          Answers are checked against LensLink&apos;s technical knowledge.
        </span>
        <button className="submit-button" disabled={isLoading} type="submit">
          {isLoading ? (
            <span aria-hidden="true" className="button-spinner" />
          ) : (
            <IconArrowUp />
          )}
          <span>{isLoading ? "Checking..." : "Check compatibility"}</span>
        </button>
      </div>
    </form>
  );

  return (
    <main className="app-frame">
      <div className="app-surface">
        <header className="topbar">
          <a aria-label="LensLink home" className="brand" href="/">
            <LensLinkMark id="brand" size={30} />
            <span className="brand-name">LensLink</span>
          </a>
          <span className="topbar-caption">Camera gear compatibility</span>
        </header>

        <div className={`stage${hasThread ? " stage-thread" : ""}`}>
          {!hasThread && (
            <section aria-labelledby="page-title" className="welcome">
              <div className="orb" aria-hidden="true">
                <LensLinkMark id="orb" size={64} />
              </div>
              <h1 id="page-title">
                Check camera
                <br />
                compatibility.
              </h1>
              <p className="welcome-sub">
                Camera gear compatibility, grounded in real technical evidence.
              </p>
            </section>
          )}

          {!hasThread && (
            <section aria-labelledby="examples-title" className="examples">
              <div className="row-head">
                <h2 id="examples-title">Start with an example</h2>
                <span>Try a real setup</span>
              </div>
              <div className="example-grid">
                {exampleQuestions.map((example, index) => {
                  const Icon = exampleIcons[index % exampleIcons.length];
                  return (
                    <button
                      className={`example-card tone-${index + 1}`}
                      disabled={isLoading}
                      key={example}
                      onClick={() => void checkQuestion(example)}
                      type="button"
                    >
                      <span aria-hidden="true" className="example-icon">
                        <Icon />
                      </span>
                      <span className="example-text">{example}</span>
                      <span aria-hidden="true" className="example-chevron">
                        <IconChevron />
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {hasThread && (
            <section aria-label="Conversation" className="thread">
              {conversation.map((entry, entryIndex) => {
                const answerBlocks =
                  entry.status === "success" ? parseAnswer(entry.answer ?? "") : [];

                return (
                  <div
                    className="conversation-turn"
                    key={entry.id}
                    ref={entryIndex === conversation.length - 1 ? latestTurnRef : undefined}
                  >
                    <div className="msg msg-user">
                      <span className="msg-author">You</span>
                      <p className="bubble">{entry.question}</p>
                    </div>

                    {entry.status === "loading" && entryIndex === conversation.length - 1 && (
                      <div aria-live="polite" className="msg msg-ai" role="status">
                        <div className="ai-head">
                          <LensLinkMark id={`load-${entry.id}`} size={28} />
                          <div>
                            <span className="ai-name">LensLink</span>
                            <span className="ai-sub">Checking camera and lens compatibility...</span>
                          </div>
                        </div>
                        <div aria-hidden="true" className="skeleton">
                          <span />
                          <span />
                          <span />
                        </div>
                      </div>
                    )}

                    {entry.status === "error" && (
                      <div aria-live="polite" className="msg msg-ai result-card" role="alert">
                        <div className="ai-head">
                          <LensLinkMark id={`error-${entry.id}`} size={28} />
                          <div>
                            <span className="ai-name">LensLink</span>
                            <span className="ai-sub">Unable to complete this response</span>
                          </div>
                        </div>
                        <div className="answer-copy">
                          <p>{entry.errorMessage}</p>
                        </div>
                      </div>
                    )}

                    {entry.status === "success" && (
                      <article
                        aria-labelledby={`result-title-${entry.id}`}
                        aria-live="polite"
                        className="msg msg-ai result-card"
                      >
                        <div className="ai-head">
                          <LensLinkMark id={`answer-${entry.id}`} size={28} />
                          <div>
                            <span className="ai-name">LensLink</span>
                            <h2 className="ai-sub" id={`result-title-${entry.id}`}>
                              {entry.toolNames.length > 0 ? "Compatibility result" : "LensLink response"}
                            </h2>
                          </div>
                        </div>

                        {answerBlocks.length > 0 && (
                          <>
                            <div className="assessment">
                              <p className="label">Assessment</p>
                              <div className="answer-copy answer-lead">
                                {renderAnswerBlock(answerBlocks[0], 0)}
                              </div>
                            </div>

                            {answerBlocks.length > 1 && (
                              <div className="details">
                                <h3>Reasoning and evidence</h3>
                                <div className="answer-copy">
                                  {answerBlocks.slice(1).map(renderAnswerBlock)}
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {entry.toolNames.length > 0 && (
                          <div className="retrieval">
                            <h3>
                              <IconDatabase />
                              Knowledge Base retrieval
                            </h3>
                            <ul aria-label="Context MCP tools used" className="tool-list">
                              {entry.toolNames.map((toolName) => <li key={toolName}>{toolName}</li>)}
                            </ul>
                          </div>
                        )}
                      </article>
                    )}
                  </div>
                );
              })}
            </section>
          )}

          <div className={`composer-dock${hasThread ? " is-docked" : ""}`}>{composer}</div>
        </div>

        <footer className="footer">
          <span>LensLink</span>
          <span>Camera compatibility, with the evidence in view.</span>
          <span className="footer-attribution">
            Built by Egbuta Ifeanyi Chukwu ·{" "}
            <a href="https://github.com/egbutaify2-ui" rel="noreferrer" target="_blank">
              @egbutaify2-ui
            </a>
          </span>
        </footer>
      </div>
    </main>
  );
}
