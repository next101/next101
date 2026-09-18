<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may
all differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing any code. Heed deprecation
notices.

<!-- END:nextjs-agent-rules -->

# Next101 — Agent Guide

## Commands

| Task             | Command           |
| ---------------- | ----------------- |
| Dev server       | `pnpm dev`        |
| Build            | `pnpm build`      |
| Lint             | `pnpm lint`       |
| Lint + fix       | `pnpm lint:fix`   |
| Format           | `pnpm format`     |
| All tests        | `pnpm test`       |
| DOM tests only   | `pnpm test:dom`   |
| Node tests only  | `pnpm test:node`  |
| Tests + coverage | `pnpm test:cov`   |
| Tests watch mode | `pnpm test:watch` |

CI order: `lint` → `test:cov`

## Architecture

- **Next.js 16** App Router + **PayloadCMS 3** + **Mantine v9**
- **PostgreSQL** via `@payloadcms/db-postgres`
- **Better Auth** for authentication (config in `src/app/(frontend)/api/auth/`)
- **Resend** for email
- Route groups:
  - `src/app/(frontend)/` — public site
  - `src/app/(payload)/` — CMS admin
  - `src/app/api/` — API routes (auth endpoints)
- Collections: `Users`, `Media` (in `src/collections/`)
- Path aliases: `@/*` → `./src/*`, `@payload-config` → `./src/payload.config.ts`

## Testing

Two Vitest projects:

- **dom** (`vitest.dom.config.mts`): Components, hooks, frontend app code. Uses
  `happy-dom`. Setup: `src/test/setup.dom.ts` (mocks `next/navigation`).
- **node** (`vitest.node.config.mts`): Collections, payload config, API routes.
  Uses `node` env. Setup: `src/test/setup.node.ts`.

Tests must live inside the include globs to run in the correct project.

## Code Style

- **Biome** (not ESLint/Prettier) — config in `biome.json`
- Single quotes, semicolons `asNeeded`, trailing commas `es5`, 80 char width
- Organize imports enabled (`assist.actions.source.organizeImports`)
- Biome ignores: `.next/`, `dist/`, `**/payload-types.ts`, `**/importMap.js`

## Git Hooks

Lefthook (not Husky). Install with `pnpx lefthook install`.

- **pre-commit**: `pnpm lint` on `*.{ts,tsx,js,jsx,json,jsonc}`
- **commit-msg**: `commitlint` with conventional commits

## Important Notes

- `payload-types.ts` is **auto-generated** by PayloadCMS. Do not hand-edit.
- `reactCompiler: true` in `next.config.ts`.
- `optimizePackageImports` configured for all `@mantine/*` packages.
- `.env` contains local dev secrets. Production values are NOT in this repo.
- `pnpm-workspace.yaml` exists but this is effectively a single-package repo.
