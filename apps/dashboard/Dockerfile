# ============================================================
# TuniERP Dashboard — Next.js (Multi-stage Build)
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

# Copy package.json for dashboard and shared packages
COPY apps/dashboard/package.json ./apps/dashboard/
COPY apps/dashboard/tsconfig.json ./apps/dashboard/
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
COPY apps/dashboard/ ./apps/dashboard/

# Generate Prisma client (if used by dashboard)
RUN pnpm --filter @tunierp/database run db:generate 2>/dev/null || true

# Set Next.js telemetry off
ENV NEXT_TELEMETRY_DISABLED=1
ENV DOCKER_BUILD=1

# Build the dashboard
RUN pnpm --filter @tunierp/dashboard run build

# ── Stage 4: Production ───────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy Next.js standalone output
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/.next/static ./apps/dashboard/.next/static

USER nextjs

EXPOSE 4052

ENV PORT=4052
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/dashboard/server.js"]
