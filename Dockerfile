# ===== 1) Build stage =====
FROM node:22-alpine AS builder

# ใช้ libc compatibility และเปิด corepack + pnpm เวอร์ชันตาม package.json
RUN apk add --no-cache libc6-compat \
 && corepack enable \
 && corepack prepare pnpm@10.18.2 --activate

WORKDIR /app

# ติดตั้ง deps ด้วย lockfile (reproducible)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# รับ env ที่ต้อง "ฝัง" ให้ฝั่ง client ของ Next
ARG NEXT_PUBLIC_BACKEND_DOMAIN_URL
ARG NEXT_PUBLIC_BACKEND_PORT
ARG NEXT_PUBLIC_ENDPOINT
ENV NEXT_PUBLIC_BACKEND_DOMAIN_URL=${NEXT_PUBLIC_BACKEND_DOMAIN_URL}
ENV NEXT_PUBLIC_BACKEND_PORT=${NEXT_PUBLIC_BACKEND_PORT}
ENV NEXT_PUBLIC_ENDPOINT=${NEXT_PUBLIC_ENDPOINT}

# ค่อย copy ที่เหลือ (ให้ได้ cache เยอะสุด)
COPY . .

# แนะนำ: เปิด standalone เพื่อลดของที่ต้อง copy (ถ้า next.config.mjs ยังไม่มี ให้เพิ่ม)
# ถ้ามีอยู่แล้วก็โอเค Next จะอ่านจากไฟล์ใน workspace อยู่ดี
# RUN node -e "console.log('build…')"
RUN pnpm build

# ตัด dev deps ทิ้ง เหลือโปรดักชัน
RUN pnpm prune --prod

# ===== 2) Runtime stage =====
FROM node:22-alpine AS runner

RUN apk add --no-cache libc6-compat \
 && addgroup -S app && adduser -S app -G app

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

# เอาเฉพาะของที่จำเป็นตอนรัน
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

USER app
EXPOSE 4000

# ใช้ npm ตอนรัน เพื่อตัด dependency ของ pnpm ใน runner
CMD ["npm", "run", "start", "--", "-p", "4000"]
