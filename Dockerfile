# syntax=docker/dockerfile:1

# 1) Base: Node + pnpm
FROM node:24-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && npm install -g pnpm@12

# 2) Deps: install from lockfile (cached when only app code changes)
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# 3) Runner: source + build + production start (full node_modules; size not optimized)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV PAYLOAD_CONFIG_PATH=src/payload.config.ts

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_BETTER_AUTH_URL
ENV NEXT_PUBLIC_BETTER_AUTH_URL=$NEXT_PUBLIC_BETTER_AUTH_URL
RUN pnpm build

RUN groupadd --system --gid 1001 next101 \
  && useradd --system --uid 1001 --gid next101 next101 \
  && chown -R next101:next101 /app \
  && chmod +x /app/docker/entrypoint.sh

USER next101
EXPOSE 3000
ENTRYPOINT ["/app/docker/entrypoint.sh"]
