# 1️⃣ Build Stage
FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat && corepack enable

WORKDIR /app

# Copy only dependency files for better cache
COPY package.json pnpm-lock.yaml* ./

# Accept build-time variable from Docker Compose
ARG NEXT_PUBLIC_ENDPOINT
ENV NEXT_PUBLIC_ENDPOINT=$NEXT_PUBLIC_ENDPOINT

# Install deps
RUN pnpm install

# ✅ Copy the rest of the project including important files
COPY . .

# Build Next.js app with the env baked in
RUN pnpm build


# 2️⃣ Production Stage
FROM node:22-alpine AS runner

RUN apk add --no-cache libc6-compat && corepack enable

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# ✅ Copy package files
COPY package.json pnpm-lock.yaml* ./

# ✅ Install only prod dependencies
RUN pnpm install --prod

# ✅ Copy required build outputs and configs
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/next.config.ts next.config.ts

EXPOSE 4000
CMD ["pnpm", "start", "-p", "4000"]