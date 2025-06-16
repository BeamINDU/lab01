# ---------- Step 1 : Build stage ----------
FROM node:22-alpine AS builder
WORKDIR /app

RUN set -eux; \
    echo "https://dl-cdn.alpinelinux.org/alpine/v$(cut -d. -f1,2 /etc/alpine-release)/community" \
        >> /etc/apk/repositories && \
    apk update && apk add --no-cache \
        build-base pkgconf cairo-dev pango-dev pixman-dev \
        jpeg-dev giflib-dev \
        libreoffice fontconfig ttf-freefont \
        bash python3 curl \
    && rm -rf /var/cache/apk/*

# ---------- dependency files ----------
COPY package*.json ./
COPY tsconfig*.json ./
COPY tailwind.config.ts ./
COPY next.config.ts ./
COPY .eslintrc.json ./
COPY postcss.config.mjs ./
COPY fontawesome.js ./

# ---------- Install npm deps ----------
RUN npm ci --legacy-peer-deps

# ---------- source ----------
COPY src ./src
COPY public ./public

# Build the application
RUN chmod +x node_modules/.bin/next
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
# Skip TypeScript checking during build
ENV NEXT_PUBLIC_DISABLE_ESLINT=true
RUN npx next build --no-lint


# ---------- Step 2 : Runtime stage ----------
FROM node:22-alpine AS runner
WORKDIR /app

# Install runtime dependencies only
RUN echo "https://dl-cdn.alpinelinux.org/alpine/v$(cut -d. -f1,2 /etc/alpine-release)/community" \
        >> /etc/apk/repositories && \
    apk update && apk add --no-cache \
        libreoffice fontconfig ttf-freefont cairo pango pixman \
    && rm -rf /var/cache/apk/*

# Copy built application and dependencies
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src

# Create user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app
USER nextjs

# Environment variables
ENV NODE_ENV=production 
ENV NEXT_TELEMETRY_DISABLED=1 
ENV PORT=3000 
ENV HOSTNAME=0.0.0.0

EXPOSE 3000
CMD ["npm", "start"]