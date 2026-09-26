# LensLink — Sanity Challenge 2026

AI camera gear compatibility agent powered by structured Sanity content.

> **Project Handoff & Progress Report**
> 
> **Challenge:** Sanity Challenge 2026 — Path One: Ship an Agent That Queries Real Content  
> **Repository:** https://github.com/egbutaify2-ui/sanity-lenslink-agent  
> **Last updated:** September 26, 2026  
> **Current checkpoint:** Milestone 2 — Studio is running; six schemas are visible; no production knowledge records have been intentionally populated yet.
>
> This README is the **living project handoff**. Update it after every meaningful milestone, verified fix, architecture change, or completed feature so another AI agent can quickly understand what has been done and continue from the current checkpoint without restarting the project.

## Project

| Item | Details |
|---|---|
| Project | LensLink |
| Challenge | Sanity Challenge 2026 — Path One |
| Repository | https://github.com/egbutaify2-ui/sanity-lenslink-agent |
| Framework | Next.js web app + standalone Sanity Studio |
| Sanity Project ID | `kv3pdv23` |
| Sanity Dataset | `production` |
| Node requirement | 22.12+ |
| Current checkpoint | Milestone 2: Studio is running; six schemas are visible; no production knowledge records have been intentionally populated yet. |

## 1. What LensLink Is

LensLink is an AI camera-gear compatibility agent. A user should be able to ask questions such as:

- “Will this lens work with my camera?”
- “Do I need an adapter?”
- “What limitations will I have?”
- “Will autofocus work?”
- “Why is this combination incompatible?”
- “What source supports that answer?”

The core idea is that LensLink must reason over **structured relationships stored in Sanity** rather than acting as a generic chatbot that guesses from text.

The intended relationship chain is:

`Camera → Camera Mount → Compatibility Rule ← Lens Native Mount`

and, when needed:

`Camera → Mount → Adapter → Mount → Lens`

Important claims must also point to **Source** records containing evidence.

### Core principle

The finished demo must make it obvious that the answer comes from **structured Sanity content and relationships**, not from an unsupported LLM guess.

## 2. What Was Already in GitHub Before This Session

The repository was already created by the previous AI agent. We continued that existing work instead of recreating the project.

Existing foundation:

- Root → `studio` → `web` monorepo structure.
- Standalone Sanity Studio configuration pointing to project `kv3pdv23` and dataset `production`.
- Six Sanity document schemas:
  - Camera
  - Lens
  - Mount
  - Adapter
  - Compatibility Rule
  - Source
- Next.js web application with an existing Sanity client/query setup.
- Existing `CAMERAS_QUERY` and initial camera knowledge-base page.

## 3. What We Completed During This Session

| Checkpoint | Result |
|---|---|
| ✅ Repository cloned locally | Cloned `https://github.com/egbutaify2-ui/sanity-lenslink-agent` into `C:\Users\Ayo\sanity-lenslink-agent`. |
| ✅ Root dependencies installed | Ran `npm install` successfully. npm reported funding notices and dependency audit vulnerabilities; no forced audit fix was performed. |
| ✅ Studio production build | Ran `npm run build:studio` successfully. |
| ✅ Web production build | Initial build found a TypeScript error in `web/src/app/page.tsx`. The camera map callback was typed as `(camera: any)`, and the file was cleaned of accidental markdown fence characters introduced while editing. The web build then completed successfully. |
| ✅ Next.js config changes | During the web build, Next.js automatically adjusted `tsconfig.json`: JSX was set to `react-jsx` and `.next/dev/types/**/*.ts` was added to include. |
| ✅ Studio dependency repair | Studio initially failed because `styled-components` was declared but not installed. Ran `npm install styled-components --workspace=studio` successfully. |
| ✅ Studio dev server verified | Ran `npm run dev:studio` successfully. Sanity Studio started at `http://localhost:3333/`. |
| ✅ Sanity login/access verified | Signed into the Studio and confirmed the project can be accessed locally. |
| ✅ Six schemas verified visually | Studio shows Camera, Lens, Adapter, Mount, Compatibility Rule, and Source. |

## 4. Current Verified State

- Sanity Studio is operational locally at `http://localhost:3333/`.
- The repository uses Sanity project `kv3pdv23` and dataset `production` in `studio/sanity.config.ts` and `studio/sanity.cli.ts`.
- All six required schema types are registered in `studio/schemas/index.ts`.
- The web application builds successfully with Next.js 16.3.6.
- The current web page can fetch camera records through the existing `CAMERAS_QUERY`.
- No meaningful compatibility knowledge base has been populated yet during this continuation session.
- No Sanity Context/MCP agent integration has been implemented yet.
- The final LensLink AI compatibility experience has not been built yet.

## 5. Schema Model Already Present

| Document type | Important fields already defined |
|---|---|
| Camera | `name`, `brand`, `model`, mount reference, `sensorFormat`, `releaseYear`, `notes`, sources |
| Lens | `name`, `brand`, `model`, `nativeMount` reference, `focalLength`, `maximumAperture`, `sensorCoverage`, `notes`, sources |
| Mount | `name`, `brand`, `description`, sources |
| Adapter | `name`, `brand`, `fromMount` reference, `toMount` reference, `electronicCommunication`, `limitations`, sources |
| Compatibility Rule | `title`, camera reference, lens reference, `compatibility result`, optional adapter, `explanation`, `conditions`, sources |
| Source | `title`, `url`, `publisher`, `retrievedAt`, `notes` |

## 6. What Remains — Continue Here

### Milestone 2 — Finish Studio verification

Open each document type and verify its form fields, references, saving, editing, and persistence.

Check:

- Camera → Mount
- Lens → Native Mount
- Adapter → From/To Mount
- Compatibility Rule → Camera/Lens/Adapter/Sources
- Source evidence fields

### Milestone 3 — Build the initial knowledge base

Create a small, carefully connected set of real camera, lens, mount, adapter, compatibility rule, and source records.

**Do not create hundreds of records.** The goal is a strong demonstration of structured reasoning.

### Milestone 4 — Source-check the data

Use authoritative manufacturer documentation where available.

Attach Source records to important claims and record relevant evidence/notes.

Do not enter unsupported assumptions.

### Milestone 5 — Connect Sanity Context/MCP

Choose and document the agent architecture, connect the agent to the existing Sanity project, verify retrieval of Cameras/Lenses/Mounts/Adapters/Rules/Sources, then test reference traversal.

### Milestone 6 — Build the LensLink user experience

Create the focused user-facing flow:

- Question input
- Compatibility answer
- Why/relationship explanation
- Limitations
- Supporting sources/evidence

### Milestone 7 — Prove structured content matters

Prepare direct compatibility, adapter, limitations, evidence, and unknown-combination demo questions.

The agent must show that it is using the structured Sanity relationships.

### Milestone 8 — Test and harden

Test:

- Valid cases
- Invalid cases
- Missing data
- Ambiguous requests
- Conflicting sources
- Unsupported/hallucination cases

The agent must not invent facts or URLs.

### Milestone 9 — UX quality pass

Check:

- Mobile/desktop
- Loading states
- Error states
- Empty states
- Long responses
- Source links
- Keyboard use
- Accessibility
- Responsive behavior

### Milestone 10 — Deploy

Deploy the Next.js application.

Configure production environment variables, keep secrets server-side, verify the Sanity project/dataset, and prove that the agent works in production.

### Milestone 11 — Demo evidence

Prepare:

- Screenshots
- Example questions/answers
- Source evidence
- Structured-content proof
- GitHub link
- Sanity project/dataset evidence

### Milestone 12 — DEV submission

Use the Path One submission template, publish the DEV post, include `#sanitychallenge`, and provide the required Sanity project/dataset evidence.

## 7. Exact Continuation Order for the Next AI

1. Do not recreate the repository, Studio, schemas, or Sanity project.
2. Start by reading this handoff and the repository README plus existing Studio/web code.
3. Verify the six Studio document forms and their references by creating test records or, preferably, the first real knowledge records when ready.
4. Populate a small connected knowledge base using real camera/lens/mount/adapter facts and authoritative sources.
5. Source-check every important compatibility claim.
6. Then connect Sanity Context/MCP and prove basic retrieval before attempting relationship reasoning.
7. Then implement the LensLink agent experience around those verified Sanity relationships.
8. Test direct compatibility, adapter reasoning, limitations, sources, unknowns, ambiguity, and hallucination resistance.
9. Deploy only after the core behavior is proven locally.
10. Prepare the judge/demo evidence and final DEV submission.

## 8. Important Rules / Do Not Break

- Do not create a new Sanity project.
- Do not create a different dataset. Keep `kv3pdv23 / production`.
- Do not replace LensLink with a generic chatbot or another idea.
- Do not replace Sanity with ordinary keyword search.
- Do not embed Sanity Studio into the Next.js app unless the architecture is deliberately changed later.
- Do not claim a feature works before testing it.
- Do not remove the existing structured content model without a concrete reason.
- Do not mix this project with unrelated projects such as Stackit.
- Do not build the final agent experience before proving that the agent can access and reason over structured Sanity content.

## 9. Current Local Commands

### Install

```bash
npm install
```

### Studio build

```bash
npm run build:studio
```

### Web build

```bash
npm run build:web
```

### Studio development

```bash
npm run dev:studio
```

### Web development

```bash
npm run dev:web
```

### Studio URL

`http://localhost:3333/`

The Next.js app uses the normal Next.js development URL.

## 10. One-Paragraph Prompt for the Next AI Agent

Continue the existing LensLink Sanity Challenge 2026 project from the GitHub repository `egbutaify2-ui/sanity-lenslink-agent`. Do not recreate the project or create a new Sanity project. Use Sanity project `kv3pdv23` and dataset `production`, preserve the root → studio → web structure, and start from the verified checkpoint in this handoff: dependencies install, Studio builds, web builds, Studio runs locally, and all six schemas are visible. The next task is to finish Milestone 2 by verifying the schema forms and references, then proceed to a small real structured knowledge base, source-check the data, connect Sanity Context/MCP, prove the agent can retrieve and traverse the structured relationships, and only then build the final LensLink compatibility UX, test it, deploy it, and prepare the DEV submission. The core requirement is that LensLink answers because it can query and reason over structured Sanity content and evidence, not because a generic LLM guessed the answer.

## 11. Handoff Maintenance Rule

This README must be updated as the project progresses.

After every meaningful piece of work:

1. Record what was completed.
2. Record what was verified and how it was verified.
3. Update the current checkpoint.
4. Update the remaining milestones so they reflect the new state.
5. Record any important architectural or dependency changes.
6. Make sure the **Exact Continuation Order** still points the next AI to the correct task.
7. Never leave the README claiming something works when it has not been tested.

The README is the project's primary **AI-to-AI continuity document**.
