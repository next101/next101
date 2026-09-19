# Next101 — Deployment Plan (self-hosted Dokploy)

Status: **ready for local verify → Dokploy**
Target: single self-hosted VPS running Dokploy (traefik routes via **Domains** tab).

## 1. Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Topology | One Dokploy **Docker Compose** service: `app` + `postgres` | Two databases in one Postgres + migrate-before-start; compose handles both natively |
| Postgres | Same-host container, `postgres:17-alpine`, named volume | Self-contained; Dokploy Volume Backups work with named volumes |
| Base image | `node:24-bookworm-slim` (Node 24 LTS) | Matches local/CI Node version; Debian slim is safest for `sharp`/`pg` |
| Package manager | **pnpm** via `npm install -g pnpm@12` in the image (no Corepack); local/CI use any pnpm that supports **lockfile v9** | No patch pin in `package.json`; `pnpm-lock.yaml` + `--frozen-lockfile` define installs |
| Image strategy | Full prod `node_modules` + `next start` (**no** `output: 'standalone'` for v1) | Migration CLIs need full deps; official Payload pattern |
| Migrations | Entrypoint: wait for DB → `payload migrate` → `auth migrate --yes` → `next start` | Both idempotent; safe on every boot |
| CI/CD | **Dokploy builds from git** on deploy (no container registry in v1) | Simpler ops; move build off the server only if it becomes a bottleneck |
| Media storage | Default Payload `upload: true` (no volume in v1) | Persistent media storage deferred; see §11 |

## 2. Findings that shaped this plan

- Two databases: `next101` (Payload) and `next101_auth` (Better Auth, separate `pg` Pool in
  `src/lib/server/auth.ts`).
- `src/migrations/` has Payload migrations; db-postgres uses migrations when `NODE_ENV=production`.
- Better Auth CLI (`auth migrate --config src/lib/server/auth.ts --yes`) supports non-interactive runs.
  The `auth` CLI package is a **runtime** dependency (entrypoint), not only dev.
- `NEXT_PUBLIC_BETTER_AUTH_URL` is inlined into the client bundle at **build time** → must be a build arg.
- `Media` collection: `upload: true` (default static dir; persistence TBD).
- Prod secrets live in Dokploy's Environment tab only — never in git or the image.

## 3. Architecture

```
                     ┌─────────────── Dokploy server ────────────────┐
 Internet ── traefik ──► app  (built from repo Dockerfile)            │
             TLS        │   boot: wait postgres                        │
                        │         payload migrate                    │
                        │         auth migrate --yes                 │
                        │         next start :3000                   │
                        │         │                                  │
                        │         ▼  compose-internal network only   │
                        │       postgres:17 ── pgdata (named volume) │
                        │         ├─ db "next101"                    │
                        │         └─ db "next101_auth"               │
                        └────────────────────────────────────────────┘
 External: Resend API, Google/GitHub OAuth
```

- `app` and `postgres` share compose **`internal`** network only; no host `ports:` mapping (Dokploy proxies to container port 3000).
- Domain/TLS/labels are configured in Dokploy's **Domains** tab (UI injects traefik labels).

## 4. Repo files (this branch)

| File | Purpose |
|---|---|
| `Dockerfile` | 3 stages on `node:24-bookworm-slim`: `base` (pnpm) → `deps` (install) → `runner` (build + start) |
| `.dockerignore` | Shrink build context |
| `compose.yml` | `app` + `postgres`, healthchecks, volumes, build args |
| `docker/entrypoint.sh` | Wait for DB → migrations → `exec next start` |
| `docker/wait-for-db.mjs` | TCP-ready check via `PAYLOAD_DATABASE_URL` |
| `docker/postgres-init.sql` | `CREATE DATABASE next101_auth;` (first volume init only) |
| `.env.example` | Template for Dokploy Environment tab + local compose |
| `package.json` | `auth` CLI in `dependencies` for entrypoint (no `packageManager` field) |

`next.config.ts` stays untouched in v1 (see §5).

## 5. Image build — and what `output: 'standalone'` is

**What standalone is.** By default, production runs the project plus `node_modules` (`next start`).
With `output: 'standalone'`, `next build` also emits `.next/standalone/` — a minimal traced bundle.
You run `node server.js` and the runtime image shrinks substantially.

**Why we're NOT using it in v1.** Deployment must run `payload migrate` and `auth migrate` with the
TypeScript config — outside the standalone trace. Full prod `node_modules` matches Payload's template:
~1 GB image, reliable admin bundle. Standalone + one-shot migrator remains an upgrade path (§11).

**Dockerfile stages.**

1. `base` — `node:24-bookworm-slim`; install `pnpm@12` with `npm install -g` (**not** Corepack).
2. `deps` — copy `package.json`, lockfile, `pnpm-workspace.yaml`; `pnpm install --frozen-lockfile`.
3. `runner` — copy deps + source; `ARG NEXT_PUBLIC_BETTER_AUTH_URL` → `ENV`; `pnpm build`; non-root
   user; entrypoint runs migrations via `node_modules/.bin` then `next start` (no runtime `pnpm install`).

## 6. Environment variables

| Variable | Phase | Value pattern |
|---|---|---|
| `NEXT_PUBLIC_BETTER_AUTH_URL` | **build arg** | `https://<domain>` — rebuild if it changes |
| `POSTGRES_PASSWORD` | runtime (compose) | Strong password; used by postgres service + URL interpolation |
| `PAYLOAD_DATABASE_URL` | runtime | `postgres://next101:<pw>@postgres:5432/next101` |
| `BETTER_AUTH_DATABASE_URL` | runtime | `postgres://next101:<pw>@postgres:5432/next101_auth` |
| `PAYLOAD_SECRET` | runtime | fresh 32-byte secret |
| `BETTER_AUTH_SECRET` | runtime | fresh 32-byte secret |
| `BETTER_AUTH_URL` | runtime | `https://<domain>` |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | runtime | verify DKIM for the sending domain |
| `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_CLIENT_ID/SECRET` | runtime | OAuth redirect URIs → prod domain |

Dokploy writes the Environment tab to `.env` beside the compose file. Compose passes `env_file: .env`
and interpolates `${NEXT_PUBLIC_BETTER_AUTH_URL}` into build args.

## 7. Migrations

On every container start (idempotent):

1. `node docker/wait-for-db.mjs`
2. `payload migrate` via `./node_modules/.bin/payload` (`PAYLOAD_CONFIG_PATH` is set in the Dockerfile)
3. `pnpm auth migrate --config src/lib/server/auth.ts --yes`
4. `exec pnpm start` (PID 1)

`depends_on: postgres: condition: service_healthy` covers normal ordering; wait script handles slow starts.

**Known risk:** whether the Better Auth CLI resolves the `@/*` tsconfig alias in `auth.ts`. Verify in
§8. Fallback: pre-generate SQL with `auth generate`, commit into `postgres-init.sql`, drop the CLI step.

## 8. Local verification (before Dokploy)

1. Copy `.env.example` → `.env`, set secrets and `NEXT_PUBLIC_BETTER_AUTH_URL` (e.g. `http://localhost:3000`).
2. `docker compose -f compose.yml build` then `docker compose -f compose.yml up`.
3. Check: both DBs exist, migrations in logs, site and `/admin` (publish port 3000 locally if needed).

## 9. Dokploy setup (one-time)

1. **Prereqs**: Dokploy on VPS; DNS A record → server IP.
2. **New Project → Docker Compose** → repo + branch, compose path `compose.yml`.
3. **Environment**: prod vars from `.env.example` — required for build + runtime: **`POSTGRES_PASSWORD`**, **`NEXT_PUBLIC_BETTER_AUTH_URL`** (must match public HTTPS URL), plus Payload/Auth/Resend secrets.
4. **Domains**: service `app`, port `3000`, HTTPS on.
5. **Deploy** → confirm migration lines in logs.
6. Smoke: site, `/admin`, password-reset email, OAuth.
7. Enable auto-deploy webhook; **Volume Backups** for `pgdata` (and/or S3 via Dokploy).

**Rollback:** Dokploy keeps prior deployments — redeploy an older record to rebuild from that git commit.
DB migrations are forward-only; roll back code, not schemas.

## 10. Backups & ops

- **Volume Backups**: `pgdata` → S3 on a schedule.
- Optional: `pg_dump` via Dokploy Schedules.
- Logs: migration output on each deploy.

## 11. Out of scope (upgrade paths)

- Prebuilt images (GHCR / other registry) + CI push — only if server-side builds hurt
- `output: 'standalone'` + one-shot migrate container
- Named volume or S3 storage adapter for `Media` (persistent uploads)
- `/api/health` + container healthcheck on `app`
- Staging environment on the same Dokploy instance