# ============================================================
# TuniERP API — NestJS (Multi-stage Build)
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

# Copy package.json files for all needed packages
COPY apps/api/package.json ./apps/api/
COPY apps/api/tsconfig.json ./apps/api/
COPY apps/api/nest-cli.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/auth/package.json ./packages/auth/
COPY packages/core/package.json ./packages/core/
COPY packages/modules/inventory/package.json ./packages/modules/inventory/
COPY packages/modules/invoicing/package.json ./packages/modules/invoicing/
COPY packages/modules/purchases/package.json ./packages/modules/purchases/
COPY packages/modules/pos/package.json ./packages/modules/pos/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# ── Stage 3: Build ─────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/ ./

# Copy source code
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Generate Prisma client
RUN pnpm --filter @tunierp/database run db:generate

# Build the API
RUN pnpm --filter @tunierp/api run build

# ── Stage 4: Production ───────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy built output and dependencies
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./apps/api/
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/packages ./packages
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./
COPY --from=builder --chown=nestjs:nodejs /app/pnpm-workspace.yaml ./

USER nestjs

EXPOSE 4060

CMD ["node", "apps/api/dist/main.js"]
