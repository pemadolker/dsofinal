# ============================================================
# Stage 1 — Dependency cache
# ============================================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only manifests first so Docker layer cache is reused
# whenever source files change but deps don't
COPY package.json package-lock.json* ./
RUN npm ci --frozen-lockfile


# ============================================================
# Stage 2 — Build
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Re-use installed modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args are injected at image-build time by CI
# (never baked into the source repo)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build


# ============================================================
# Stage 3 — Production image (nginx, ~25 MB)
# ============================================================
FROM nginx:1.27-alpine AS production

# Remove default nginx config and replace with ours
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/app.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Run as non-root user (security hardening)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /usr/share/nginx/html \
    && chown -R appuser:appgroup /var/cache/nginx \
    && touch /var/run/nginx.pid \
    && chown appuser:appgroup /var/run/nginx.pid

USER appuser

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
