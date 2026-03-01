# ============================================================
# TuniERP Frontend — Next.js (Multi-stage Build)
# ============================================================

# ── Stage 1: Base ──────────────────────────────────────────
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
RUN apk add --no-cache libc6-compat

# ── Stage 2: Install dependencies ──────────────────────────
FROM base AS deps
WORKDIR /app

# Copy workspace config
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json tsconfig.base.json ./

# Copy package.json for frontend and shared packages
COPY front/package.json ./front/
COPY packages/database/package.json ./packages/database/
COPY packages/auth/package.json ./packages/auth/
COPY packages/core/package.json ./packages/core/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# ── Stage 3: Build ─────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/ ./

# Copy source code
COPY packages/ ./packages/
COPY front/ ./front/

# Generate Prisma client (if used by front)
RUN pnpm --filter @tunierp/database run db:generate 2>/dev/null || true

# Set Next.js telemetry off
ENV NEXT_TELEMETRY_DISABLED=1
ENV DOCKER_BUILD=1

# Build the frontend
RUN pnpm --filter tunierp-frontend run build

# ── Stage 4: Production ───────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/front/public ./front/public

# Copy Next.js standalone output
COPY --from=builder --chown=nextjs:nodejs /app/front/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/front/.next/static ./front/.next/static

USER nextjs

EXPOSE 4050

ENV PORT=4050
ENV HOSTNAME="0.0.0.0"

CMD ["node", "front/server.js"]
