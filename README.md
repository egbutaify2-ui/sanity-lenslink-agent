# LensLink — Sanity Challenge 2026

AI camera gear compatibility agent powered by structured Sanity content.

> **Project Handoff & Progress Report**
>
> **Challenge:** Sanity Challenge 2026 — Path One: Ship an Agent That Queries Real Content  
> **Repository:** https://github.com/egbutaify2-ui/sanity-lenslink-agent  
> **Last updated:** September 26, 2026  
> **Current checkpoint:** **Milestone 3 — Initial knowledge base is next. Milestone 2 Studio/schema/reference verification is complete. Sanity MCP is configured; live VS Code MCP verification is pending AI credits.**
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
| Current checkpoint | **Milestone 3 — Build the initial structured knowledge base next. Sanity MCP is configured, but live VS Code MCP access still needs verification.** |

## Progress Tracker

This is the project's **working completion tracker**. Percentages are practical planning estimates, not an official Sanity score.

| Stage | Status | Progress |
|---|---|---:|
| Foundation / project setup | ✅ Complete | 100% |
| Milestone 2 — Studio/schema/reference verification | ✅ Complete | 100% |
| Milestone 3 — Initial real knowledge base | ⏳ Next | 0% |
| Milestone 4 — Source verification | ⏳ Pending | 0% |
| Milestone 5 — Sanity Context/MCP agent | ⏳ Pending | 0% |
| Milestone 6 — LensLink user experience | ⏳ Pending | 0% |
| Milestone 7 — Prove structured reasoning | ⏳ Pending | 0% |
| Milestone 8 — Testing / hardening | ⏳ Pending | 0% |
| Milestone 9 — UX quality pass | ⏳ Pending | 0% |
| Milestone 10 — Deployment | ⏳ Pending | 0% |
| Milestone 11 — Demo evidence | ⏳ Pending | 0% |
| Milestone 12 — DEV submission | ⏳ Pending | 0% |

### Practical progress checkpoints

- **Current:** foundation + Milestone 2 complete; overall practical progress is estimated at **~20%**.
- **After Milestone 3:** real structured knowledge base exists.
- **After Milestone 5:** the core Sanity-powered agent architecture is connected and retrieval is proven.
- **After Milestone 6:** the core LensLink product experience should be working; overall practical progress is estimated at **~70%**.
- **After Milestones 7–11:** the core behavior is proven, hardened, polished, deployed, and demo-ready.
- **After Milestone 12:** submission is complete; target is **100% project completion**.

The percentages are used only to track our own movement through the project. They must not be presented as an official contest/judging score.

## Sanity MCP Setup Checkpoint

Sanity MCP configuration was initiated and completed on **September 26, 2026**.

Verified:

- ✅ Ran `npx sanity@latest mcp configure` from the LensLink repository.
- ✅ Sanity CLI authentication completed successfully through the browser login flow.
- ✅ The Sanity MCP server was configured for:
  - Claude Code
  - GitHub Copilot CLI
  - VS Code
- ✅ Configuration completed without an error.
- ⏳ The VS Code AI agent has **not yet verified live MCP access** to the Sanity project because the user currently has no VS Code AI/Copilot credit available.
- ⏳ No Sanity MCP content changes were made during this setup checkpoint.

### Next MCP verification

When VS Code AI access/credits are available, open the repository in VS Code and ask the agent to verify:

- Sanity MCP availability
- Available Sanity MCP tools
- Access to project `kv3pdv23`
- Access to dataset `production`
- Ability to read the existing schemas/content

**Do not allow the agent to create, edit, delete, publish, or migrate Sanity content during the first verification request.**

Only after live MCP access is confirmed should Milestone 3 content creation be automated through Sanity MCP.


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
| ✅ Milestone 2 form verification | Opened and verified all six document forms and their expected fields in the Sanity Studio. |
| ✅ Camera → Mount reference verified | Created a temporary test Camera, linked it to the temporary test Mount, published it, reopened it, and confirmed the reference persisted. |
| ✅ Lens → Native Mount reference verified | Created a temporary test Lens, linked it to the temporary test Mount, published it, reopened it, and confirmed the reference persisted. |
| ✅ Mount → Sources reference verified | Created a temporary test Source, attached it to the temporary test Mount, published it, reopened the Mount, and confirmed the Source remained attached. |
| ✅ Adapter → From/To Mount references verified | Created a temporary test Adapter, linked both From Mount and To Mount to the temporary test Mount, published it, reopened it, and confirmed both references persisted. |
| ✅ Compatibility Rule → Camera/Lens verified | Created a temporary Compatibility Rule linked to the temporary test Camera and Lens, published it, reopened it, and confirmed both references persisted. |
| ✅ Compatibility Rule → Required Adapter verified | Edited the published Compatibility Rule, added the temporary test Adapter as Required Adapter, republished it, and confirmed the reference persisted. |
| ✅ Compatibility Rule → Sources verified | Edited the published Compatibility Rule again, added the temporary test Source, republished it, and confirmed the Source reference persisted. |
| ✅ Milestone 2 completed | All six schemas, their important fields, the required reference paths, saving, editing, and persistence checks are now verified locally in Studio. |

## 4. Current Verified State

- Sanity Studio is operational locally at `http://localhost:3333/`.
- The repository uses Sanity project `kv3pdv23` and dataset `production` in `studio/sanity.config.ts` and `studio/sanity.cli.ts`.
- All six required schema types are registered in `studio/schemas/index.ts`.
- The web application builds successfully with Next.js 16.3.6.
- The current web page can fetch camera records through the existing `CAMERAS_QUERY`.
- **Milestone 2 is complete:** the six Studio forms and the required references have been manually verified, including publish/reopen persistence and editing of the Compatibility Rule.
- Temporary Milestone 2 test records currently exist in the Sanity dataset. **Remove these test records before creating the real knowledge base** unless they are intentionally repurposed.
- No meaningful real compatibility knowledge base has been intentionally populated yet.
- No Sanity Context/MCP agent integration has been implemented yet.
- **Sanity MCP setup is configured for the development AI tools**, but live VS Code MCP access still needs to be verified when AI credits are available.
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

### Milestone 3 — Build the initial knowledge base

**Status: ⏳ NEXT**

This is the **next task**.

Create a small, carefully connected set of **real** camera, lens, mount, adapter, compatibility rule, and source records.

Requirements:

- Use real camera and lens compatibility facts.
- Prefer authoritative manufacturer documentation for the supporting evidence.
- Keep the dataset intentionally small; do not create hundreds of records.
- Build records so the relationship graph can demonstrate direct compatibility, adapter-required compatibility, and incompatible/unknown cases.
- Attach Source records to important claims.
- Do not use the temporary Milestone 2 test records as real knowledge unless deliberately verified and repurposed.

### Milestone 4 — Source-check the data

**Status: ⏳ PENDING**

Use authoritative manufacturer documentation where available.

Attach Source records to important claims and record relevant evidence/notes.

Do not enter unsupported assumptions.

### Milestone 5 — Connect Sanity Context/MCP

**Status: ⏳ PENDING**

Choose and document the agent architecture, connect the agent to the existing Sanity project, verify retrieval of Cameras/Lenses/Mounts/Adapters/Rules/Sources, then test reference traversal.

### Milestone 6 — Build the LensLink user experience

**Status: ⏳ PENDING — target checkpoint: ~70% overall**

Create the focused user-facing flow:

- Question input
- Compatibility answer
- Why/relationship explanation
- Limitations
- Supporting sources/evidence

### Milestone 7 — Prove structured content matters

**Status: ⏳ PENDING**

Prepare direct compatibility, adapter, limitations, evidence, and unknown-combination demo questions.

The agent must show that it is using the structured Sanity relationships.

### Milestone 8 — Test and harden

**Status: ⏳ PENDING**

Test:

- Valid cases
- Invalid cases
- Missing data
- Ambiguous requests
- Conflicting sources
- Unsupported/hallucination cases

The agent must not invent facts or URLs.

### Milestone 9 — UX quality pass

**Status: ⏳ PENDING**

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

**Status: ⏳ PENDING**

Deploy the Next.js application.

Configure production environment variables, keep secrets server-side, verify the Sanity project/dataset, and prove that the agent works in production.

### Milestone 11 — Demo evidence

**Status: ⏳ PENDING**

Prepare:

- Screenshots
- Example questions/answers
- Source evidence
- Structured-content proof
- GitHub link
- Sanity project/dataset evidence

### Milestone 12 — DEV submission

**Status: ⏳ PENDING**

Use the Path One submission template, publish the DEV post, include `#sanitychallenge`, and provide the required Sanity project/dataset evidence.

## 7. Exact Continuation Order for the Next AI

1. Do not recreate the repository, Studio, schemas, or Sanity project.
2. Read this handoff and the existing Studio/web code before making architecture changes.
3. Treat **Milestone 2 as complete**. Do not repeat the schema verification unless a later change breaks it.
4. Remove or clearly isolate the temporary Milestone 2 test records before the real knowledge base is created.
5. Populate a small connected knowledge base using real camera/lens/mount/adapter facts and authoritative sources.
6. Source-check every important compatibility claim.
7. When VS Code AI credits are available, first verify the already-configured Sanity MCP connection in read-only mode; do not mutate content during this verification.
8. Then build the real knowledge base through the verified Sanity MCP workflow where appropriate.
9. Then connect Sanity Context/MCP and prove basic retrieval before attempting relationship reasoning.
10. Then implement the LensLink agent experience around those verified Sanity relationships.
11. Test direct compatibility, adapter reasoning, limitations, sources, unknowns, ambiguity, and hallucination resistance.
12. Deploy only after the core behavior is proven locally.
13. Prepare the judge/demo evidence and final DEV submission.

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

Continue the existing LensLink Sanity Challenge 2026 project from the GitHub repository `egbutaify2-ui/sanity-lenslink-agent`. Do not recreate the project or create a new Sanity project. Use Sanity project `kv3pdv23` and dataset `production`, preserve the root → studio → web structure, and treat **Milestone 2 as complete**: all six Studio forms were verified, the key reference relationships were tested, records were published/reopened successfully, and the Compatibility Rule was edited and republished successfully. The next task is **Milestone 3: remove/isolate the temporary test records and build a small real structured knowledge base** using verified camera, lens, mount, adapter, compatibility-rule, and source records. When VS Code AI access is available, first verify the configured Sanity MCP connection before automating content creation. Use the Progress Tracker in this README to track movement; after Milestone 6, the practical target is approximately 70% complete, with the remaining work focused on proving, hardening, polishing, deploying, and submitting the project. Then source-check the data, connect Sanity Context/MCP, prove the agent can retrieve and traverse the structured relationships, and only then build the final LensLink compatibility UX, test it, deploy it, and prepare the DEV submission. The core requirement is that LensLink answers because it can query and reason over structured Sanity content and evidence, not because a generic LLM guessed the answer.

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
