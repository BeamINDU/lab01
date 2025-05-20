# Step 1: Build stage
FROM node:22-alpine AS builder

# Set working directory inside container
WORKDIR /app

# Install dependencies needed for LibreOffice if really required (you may remove if unused)
RUN apk update && apk add --no-cache \
    libreoffice \
    bash \
    fontconfig \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Copy config and dependency files
COPY ../package*.json ./
COPY ../tsconfig*.json ./
COPY ../tailwind.config.ts ./
COPY ../next.config.ts ./
COPY ../.eslintrc.json ./
COPY ../postcss.config.mjs ./
COPY ../fontawesome.js ./

# Install dependencies
RUN npm install --legacy-peer-deps
RUN npm install @mui/x-date-pickers @mui/material @emotion/react @emotion/styled dayjs
RUN npm install react-image-annotate

# ? COPY source code **after** installing dependencies to avoid overwriting node_modules
COPY . .

# ?? Fix permission issue with next
RUN chmod +x node_modules/.bin/next

# Build the Next.js application
RUN npm run build

# Expose the port (adjust as needed)
EXPOSE 3000

# Start the app (or replace with `next start` if using standalone)
CMD ["npm", "start"]
