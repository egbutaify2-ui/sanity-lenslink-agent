# LensLink

AI camera gear compatibility agent powered by structured Sanity content.

## Sanity

- Project: Sanity Challenge 2026
- Project ID: `kv3pdv23`
- Dataset: `production`

## Repository

`https://github.com/egbutaify2-ui/sanity-lenslink-agent`

## Structure

- `studio/` — standalone Sanity Studio and structured content schemas
- `web/` — Next.js application connected to Sanity

## Content model

The Studio currently models:

- Cameras
- Lenses
- Mounts
- Adapters
- Compatibility rules
- Sources

The content model is designed so the future agent can reason across camera, lens, mount, adapter, and evidence relationships instead of relying on keyword-only search.

## Local development

Requirements: Node.js 22.12+.

```bash
npm install
npm run dev:studio
npm run dev:web
```

The Sanity Studio runs on `http://localhost:3333`. The Next.js app uses the normal Next.js development URL.

## Challenge

LensLink is being built for the Sanity Challenge Path One: an AI agent that queries real structured content through Sanity Context/MCP.
