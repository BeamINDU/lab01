FROM node:22-alpine
WORKDIR /app

# Install canvas dependencies and build tools
RUN apk add --no-cache \
    libreoffice fontconfig ttf-freefont \
    curl python3 make g++ \
    cairo-dev cairo cairo-tools \
    pango-dev pango \
    pixman-dev pixman \
    jpeg-dev jpeg \
    giflib-dev giflib \
    librsvg-dev \
    build-base \
    pkgconfig

# Copy package files
COPY package*.json ./

# Install dependencies and rebuild native modules
RUN npm install --legacy-peer-deps
RUN npm rebuild canvas

# Copy all source code
COPY . .

# Fix next.config.ts warning first
RUN sed -i 's/appDir.*,//g' next.config.ts || true

# Build the app
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]