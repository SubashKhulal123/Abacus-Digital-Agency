# ---- Build stage -----------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

# ---- Production stage -------------------------------------------------
FROM node:20-alpine AS production
WORKDIR /app

# Run as a non-root user — standard container security practice
RUN addgroup -g 1001 -S nodejs && adduser -S abacus -u 1001

COPY --from=builder --chown=abacus:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=abacus:nodejs /app/package*.json ./
COPY --from=builder --chown=abacus:nodejs /app/server.js ./
COPY --from=builder --chown=abacus:nodejs /app/src ./src

USER abacus

ENV NODE_ENV=production
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/v1/health', (r) => process.exit(r.statusCode===200?0:1)).on('error', () => process.exit(1))"

CMD ["node", "server.js"]
