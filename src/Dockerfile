# Step 1: Build stage
FROM node:22-alpine AS builder

# Set working directory inside container
WORKDIR /app

# Install system dependencies needed for LibreOffice and build tools
RUN apk update && apk add --no-cache \
    libreoffice \
    bash \
    fontconfig \
    ttf-freefont \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Copy config and dependency files
COPY ../package*.json ./
COPY ../tsconfig*.json ./
COPY ../tailwind.config.ts ./
COPY ../next.config.ts ./
COPY ../.eslintrc.json ./
COPY ../postcss.config.mjs ./
COPY ../fontawesome.js ./


RUN npm install --legacy-peer-deps
RUN npm install chart.js react-chartjs-2 chartjs-plugin-datalabels recharts
RUN npm install @mui/x-date-pickers @mui/material @emotion/react @emotion/styled dayjs
RUN npm install react-hook-form @hookform/resolvers zod
RUN npm install file-saver exceljs papaparse @types/papaparse
RUN npm install react-select react-dropzone lodash @types/lodash
RUN npm install socket.io-client
RUN npm install zustand
RUN npm install sweetalert2 react-toastify
RUN npm install next-auth nextjs-toploader
RUN npm install react-image-annotate
RUN npm install konva react-konva lucide-react
RUN npm install date-fns
RUN npm install mammoth

COPY . .


RUN chmod +x node_modules/.bin/next


RUN npm run build


FROM node:22-alpine AS runner

WORKDIR /app


RUN apk add --no-cache \
    libreoffice \
    fontconfig \
    ttf-freefont


COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public


RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001


RUN chown -R nextjs:nodejs /app
USER nextjs


EXPOSE 3000


HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1


CMD ["npm", "start"]