# LensLink

AI camera-gear compatibility agent powered by structured Sanity content, Sanity Context MCP, and Gemini.

LensLink answers camera/lens compatibility questions by retrieving structured, evidence-backed content from a Sanity Knowledge Base before generating the response. The goal is to make the reasoning path visible: the agent is not relying on an unsupported model guess.

## Live project

- **Production:** https://lenslink-civq.onrender.com
- **Repository:** https://github.com/egbutaify2-ui/sanity-lenslink-agent
- **Sanity Project ID:** kv3pdv23
- **Sanity Dataset:** production
- **Challenge:** Sanity Challenge 2026 — Path One: Ship an Agent That Queries Real Content
- **Challenge tag:** #sanitychallenge

## How LensLink works

The core architecture is:

~~~text
Structured Sanity content
        ↓
Sanity Knowledge Base
        ↓
Sanity Context MCP
        ↓
LensLink agent
        ↓
Gemini
        ↓
Grounded compatibility answer
~~~

LensLink uses a dedicated Sanity Context MCP endpoint backed by the LensLink Knowledge Base. For compatibility questions, the server-side agent retrieves the required context and Knowledge Base evidence before Gemini generates the answer.

The current retrieval path is:

~~~text
initial_context
      ↓
knowledge_base_search
      ↓
knowledge_base_read
      ↓
Gemini generation
~~~

The browser never receives the Gemini API key or Sanity organization token.

Sanity Context is a read-only MCP interface to Sanity content. LensLink uses Knowledge Base mode so the agent reads the indexed LensLink knowledge rather than querying an unrelated content source. See the [Sanity Context documentation](https://www.sanity.io/docs/ai/sanity-context-mcp).

## Structured content model

LensLink models compatibility as relationships between reusable Sanity documents:

~~~text
Camera → Mount
Lens → Mount
Adapter → From Mount / To Mount
Compatibility Rule → Camera / Lens / Adapter
Source → evidence
~~~

The important document types are:

- **Camera** — camera body information and its mount.
- **Lens** — lens information and its native mount.
- **Mount** — reusable mount definitions such as Canon RF, EF, and EF-M.
- **Adapter** — an adapter's source mount, destination mount, electronic communication, limitations, and sources.
- **Compatibility Rule** — a specific camera/lens relationship with a compatibility result, optional adapter, explanation, conditions, and supporting sources.
- **Source** — evidence metadata such as URL, publisher, and retrieval date.

This structure lets the agent distinguish a native match from an adapter path or a documented unsupported pairing.

## Evidence-state semantics

LensLink distinguishes three evidence states for compatibility conclusions:

- **Documented compatible** — an explicit compatibility rule is present with supporting source evidence.
- **Documented incompatible** — an explicit negative compatibility rule is present with supporting source evidence.
- **Evidence-limited / unknown** — the compatibility rule, supporting source, or explicit pairing evidence is missing or insufficient. In this state LensLink does not ask Gemini to invent a compatibility conclusion.


## Real Canon reasoning cases

The current Knowledge Base contains the Canon examples used in the live proof.

### 1. RF50mm F1.8 STM + EOS R5

The EOS R5 uses a Canon RF mount and the RF50mm F1.8 STM uses the Canon RF mount.

LensLink retrieves the corresponding compatibility and lens records and answers that the pairing is **directly compatible** with no adapter.

### 2. EF50mm f/1.8 STM + EOS R5

The EOS R5 uses RF while the EF50mm uses EF.

The Knowledge Base also contains the **Canon Mount Adapter EF-EOS R**, connecting Canon EF to Canon RF.

LensLink therefore answers that the lens is **compatible with the adapter**, and identifies the required adapter.

### 3. EF-M 22mm f/2 STM + EOS R5

The EF-M 22mm uses the EF-M mount while the EOS R5 uses RF.

The retrieved records document this pairing as **not compatible**. The live proof also prevents the agent from turning that evidence into a stronger unsupported claim such as "physically impossible."

Together, these three cases demonstrate three different structured reasoning paths: same-mount compatibility, an adapter-mediated relationship, and a documented unsupported relationship.

## Evidence and verification

The repository includes the live integration proof used to verify the Context MCP-backed agent:

- [web/scripts/milestone-7-proof.test.mjs](web/scripts/milestone-7-proof.test.mjs)
- [web/milestone-7-evidence.json](web/milestone-7-evidence.json)

The evidence artifact records:

- the real questions sent to LensLink
- the Context MCP tools used
- Knowledge Base search inputs
- Knowledge Base paths read
- the returned evidence text
- the resulting Gemini answers
- validation results for all three scenarios

The proof runs against the configured live Gemini and Sanity Context MCP services; it does not mock the model, MCP tools, or Knowledge Base records.

## Running locally

### Requirements

- Node.js 22.12+
- Access to the LensLink Sanity project and Knowledge Base
- A Gemini API key
- A Sanity organization token with Context Viewer permission
- The LensLink Context MCP endpoint URL

### Install

~~~bash
npm install
~~~

### Run the web app

~~~bash
npm run dev:web
~~~

### Run Sanity Studio

~~~bash
npm run dev:studio
~~~

### Build

~~~bash
npm run build:web
npm run build:studio
~~~

## Environment variables

Use environment variable names only; never commit real values.

### Web / client configuration

~~~text
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_API_VERSION
~~~

### Server-only agent configuration

~~~text
GOOGLE_GENERATIVE_AI_API_KEY
SANITY_CONTEXT_MCP_URL
SANITY_ORGANIZATION_TOKEN
~~~

Server-only credentials must stay outside the browser and should be stored in a local environment file or the hosting platform's secret configuration.

## Tests

The project includes:

~~~bash
npm run test:api
npm run test:milestone-7
~~~

The API test covers malformed JSON, invalid request bodies, missing/blank questions, and valid question parsing.

The Milestone 7 proof is the live end-to-end check for the three structured compatibility scenarios and the Sanity Context MCP retrieval path.

A TypeScript check can be run with:

~~~bash
npx tsc --noEmit -p web/tsconfig.json
~~~

## Key files for reviewers

### Agent and API

- [web/src/lib/lenslink-agent.ts](web/src/lib/lenslink-agent.ts) — Context MCP retrieval and evidence-grounded agent orchestration.
- [web/src/lib/lenslink-model.ts](web/src/lib/lenslink-model.ts) — Gemini provider/model configuration.
- [web/src/app/api/lenslink/route.ts](web/src/app/api/lenslink/route.ts) — server endpoint used by the LensLink UI.

### Sanity schemas

- [studio/schemas/camera.ts](studio/schemas/camera.ts)
- [studio/schemas/lens.ts](studio/schemas/lens.ts)
- [studio/schemas/mount.ts](studio/schemas/mount.ts)
- [studio/schemas/adapter.ts](studio/schemas/adapter.ts)
- [studio/schemas/compatibilityRule.ts](studio/schemas/compatibilityRule.ts)
- [studio/schemas/source.ts](studio/schemas/source.ts)

### Proof and evidence

- [web/scripts/milestone-7-proof.test.mjs](web/scripts/milestone-7-proof.test.mjs)
- [web/milestone-7-evidence.json](web/milestone-7-evidence.json)

## Project structure

~~~text
.
├── studio/   # Sanity Studio and structured content schemas
└── web/      # Next.js application and server-side LensLink agent
~~~

## Why the structured model matters

LensLink is designed so compatibility answers can be traced back to structured entities and their relationships.

For the Canon examples, the agent can reason through relationships such as:

~~~text
EOS R5
  └── Canon RF Mount
        ├── RF50mm F1.8 STM
        └── EF-EOS R Adapter
              └── Canon EF Mount
                    └── EF50mm f/1.8 STM
~~~

The EF-M case is represented separately through its EF-M mount and the corresponding compatibility evidence. This makes the distinction between direct compatibility, adapter-required compatibility, and an unsupported relationship explicit in the content model.

## Status

LensLink is deployed and available at the production URL above. The public repository contains the implementation, Sanity schemas, live integration proof, and retrieved evidence used to demonstrate the Path One architecture.

## Challenge

LensLink was built for the [Sanity Challenge 2026 — Path One: Ship an Agent That Queries Real Content](https://dev.to/challenges/sanity-2026-09-16).

#sanitychallenge
