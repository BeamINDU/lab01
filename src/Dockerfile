FROM node:22-alpine
WORKDIR /app

# Install dependencies and build tools
RUN apk add --no-cache \
    curl python3 make g++ \
    cairo-dev cairo cairo-tools \
    pango-dev pango \
    pixman-dev pixman \
    jpeg-dev jpeg \
    giflib-dev giflib \
    librsvg-dev \
    build-base \
    pkgconfig

# ------------------------------
# Set NODE_ENV early
ENV NODE_ENV=production
# ------------------------------

# Copy package files
COPY package*.json ./

# Install dependencies and rebuild native modules
RUN npm install --legacy-peer-deps
RUN npm rebuild canvas

# Copy environment file (if exists)
COPY .env* ./

# Copy all source code
COPY . .

# Optional: Remove experimental next.config.ts flags
RUN sed -i 's/appDir.*,//g' next.config.ts || true

# Build the app (uses NODE_ENV=production)
RUN npm run build

EXPOSE 3032

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the app
CMD ["npm", "start"]
