# Starfold

> A Next.js SaaS starter kit with everything you need to go from zero to
> production in minutes.

[![GitHub CI](https://github.com/starfold/starfold/workflows/test/badge.svg)](https://github.com/starfold/starfold/actions/workflows/test.yml)
[![License](https://img.shields.io/badge/License-PolyForm%20Noncommercial%201.0.0-blue?style=flat-square)](https://github.com/starfold/starfold/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-FE5196?style=flat-square&logo=conventionalcommits)](https://conventionalcommits.org)
[![Biome](https://img.shields.io/badge/Biome-Linted-60a5fa?style=flat-square&logo=biome)](https://biomejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-Tested-6E9F18?style=flat-square&logo=vitest)](https://vitest.dev/)

Starfold is a carefully curated, production-ready starter built on **Next.js
16**, **Payload CMS 3**, and **Mantine v9**. It wires together modern auth,
payments, CMS, emails, and UI so you can skip the boilerplate and focus on your
product.

---

## What's Inside

| Feature              | Description                                                                     |
| -------------------- | ------------------------------------------------------------------------------- |
| **Next.js 16**       | App Router, server components, and streaming SSR                                |
| **Mantine v9**       | 120+ customizable components and 70+ hooks                                      |
| **Better Auth**      | Type-safe auth with OAuth, magic links, password reset, and sessions            |
| **Payload CMS**      | Headless CMS with PostgreSQL, auto-generated admin UI, rich text, and typed API |
| **Payments**         | Subscription billing, checkout sessions, and webhooks ready to monetize         |
| **Emails**           | Transactional emails for welcomes, password resets, and notifications           |
| **Blogs**            | SEO-optimized publishing with rich text editing and media management            |
| **Docs**             | Markdown-based documentation site built-in                                      |
| **i18n**             | Multi-language infrastructure with RTL support                                  |
| **TypeScript**       | End-to-end type safety from the database schema to UI components                |
| **Dark Mode**        | Auto-detecting color scheme toggle across all components                        |
| **Rich Text Editor** | TipTap and Lexical-powered editing with embeds and custom blocks                |

---

## Core Design

Starfold uses a **dual-auth architecture** that unifies admin and customer
authentication through Payload's access control system.

- **Payload CMS** handles data modeling and admin panel access. Collections are
  defined declaratively, eliminating boilerplate CRUD.
- **Better Auth** powers the customer-facing application with OAuth, magic
  links, and session management.
- **Unified access control** via Payload's collection hooks:
  - `isPayloadUser()` — grants unscoped admin access.
  - `isCustomer()` — resolves Better Auth sessions for app users.
  - `isOwner()` — scopes queries to the current user's documents using an
    `ownerId` field.

This means Payload admins get root access to all data, while app users only see
and mutate what they own — all enforced at the collection level.

---

## Project Structure

```
src/
├── app/
│   ├── (frontend)/      # Public site, auth pages, app routes (e.g. /notes)
│   ├── (payload)/       # CMS admin panel at /admin
│   └── api/             # API routes (Better Auth endpoints)
├── collections/         # Payload collections (Users, Media, Notes, etc.)
├── components/          # React components organized by feature
├── fields/              # Reusable Payload fields (e.g. ownerId)
├── hooks/               # Custom React hooks
├── lib/server/          # Server utilities, auth, DAL
├── payload.config.ts    # Payload CMS configuration
└── test/                # Test utilities and setup
```

---

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm
- PostgreSQL

### 1. Clone and install

```bash
git clone <repo-url> starfold
cd starfold
pnpm install
```

### 2. Set up environment variables

```bash
cp .env .env.local
```

Update `.env.local` with your own secrets:

| Variable                                    | Description                                 |
| ------------------------------------------- | ------------------------------------------- |
| `PAYLOAD_DATABASE_URL`                      | PostgreSQL URL for Payload                  |
| `PAYLOAD_SECRET`                            | Random secret for Payload                   |
| `BETTER_AUTH_DATABASE_URL`                  | PostgreSQL URL for Better Auth              |
| `BETTER_AUTH_SECRET`                        | Random secret for Better Auth               |
| `BETTER_AUTH_URL`                           | Your app URL (e.g. `http://localhost:3000`) |
| `RESEND_API_KEY`                            | Resend API key for emails                   |
| `RESEND_FROM_EMAIL`                         | Verified sender email                       |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials                    |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth credentials                    |

### 3. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page. The
Payload admin panel is at
[http://localhost:3000/admin](http://localhost:3000/admin).

---

## Available Commands

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `pnpm dev`        | Start development server     |
| `pnpm build`      | Build for production         |
| `pnpm lint`       | Run Biome linter             |
| `pnpm lint:fix`   | Run linter with auto-fix     |
| `pnpm format`     | Format code with Biome       |
| `pnpm test`       | Run all tests                |
| `pnpm test:dom`   | Run DOM/component tests only |
| `pnpm test:node`  | Run Node/server tests only   |
| `pnpm test:cov`   | Run tests with coverage      |
| `pnpm test:watch` | Run tests in watch mode      |

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **CMS**: [Payload CMS 3](https://payloadcms.com) with PostgreSQL
- **Auth**: [Better Auth](https://www.better-auth.com)
- **UI**: [Mantine v9](https://mantine.dev)
- **Database**: PostgreSQL via `@payloadcms/db-postgres`
- **Email**: [Resend](https://resend.com)
- **Testing**: [Vitest](https://vitest.dev) (DOM + Node environments)
- **Linting**: [Biome](https://biomejs.dev)

---

## License

PolyForm Noncommercial License 1.0.0
