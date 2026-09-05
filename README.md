# ProjectMentor AI

ProjectMentor AI is a responsive AI project workspace for final-year students. It helps students move from a project idea to a practical blueprint with project discovery, roadmap planning, architecture guidance, documentation drafts, viva preparation, and a contextual AI mentor.

## Current MVP

- Responsive ProjectMentor AI dashboard
- Student onboarding wizard
- Demo-mode personalized project recommendations
- Project blueprints with architecture and milestone guidance
- Saved projects persisted in browser storage
- Contextual AI Mentor demo chat
- Roadmap task tracking and progress
- Architecture, documentation, and viva coach workspaces
- Explore/search project library
- Light and dark themes

The UI currently runs in **Demo AI Mode**. The next integration step is to connect server-side Gemini functions for project generation, mentor chat, architecture, documentation, and viva coaching.

## Run locally

```bash
pnpm install
pnpm --filter @workspace/projectmentor-ai run dev
```

The full workspace also includes the shared API server:

```bash
pnpm --filter @workspace/api-server run dev
```

## Checks

```bash
pnpm --filter @workspace/projectmentor-ai run typecheck
pnpm run typecheck
```

## Workspace structure

- `artifacts/projectmentor-ai` — ProjectMentor AI web application
- `artifacts/api-server` — shared Express API server
- `lib/api-spec` — OpenAPI source of truth
- `lib/api-client-react` — generated React API client
- `lib/api-zod` — generated API validation schemas
- `lib/db` — Drizzle database package

## Roadmap

1. Add server-side Gemini integration with structured response validation.
2. Persist profiles, projects, mentor conversations, and roadmap state in PostgreSQL.
3. Add managed authentication and per-student project workspaces.