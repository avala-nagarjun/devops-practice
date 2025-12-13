# --- Stage 1: Builder ---
FROM node:25-alpine3.22 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Runner ---
# We start fresh with a new image to keep it small
FROM node:18-alpine AS runner
WORKDIR /app

# Create a non-root user (Security Best Practice)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only the necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# before adding below line add output: 'standalone', to next.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

USER nextjs
EXPOSE 3000
ENV PORT=3000

# We run "server.js", which Next.js standalone mode creates for us
CMD ["node", "server.js"]
