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
COPY tailwind.config.ts .
COPY next.config.ts .
COPY .eslintrc.json .
COPY postcss.config.mjs .
COPY fontawesome.js .

# ---------- Install npm deps ----------
RUN npm install --legacy-peer-deps \
  && npm install chart.js react-chartjs-2 chartjs-plugin-datalabels recharts \
  && npm install @mui/x-date-pickers @mui/material @emotion/react @emotion/styled dayjs \
  && npm install react-hook-form @hookform/resolvers zod \
  && npm install file-saver exceljs papaparse @types/papaparse \
  && npm install react-select react-dropzone lodash @types/lodash \
  && npm install socket.io-client zustand \
  && npm install sweetalert2 react-toastify \
  && npm install next-auth nextjs-toploader react-color \
  && npm install canvas \
  && npm install konva react-konva lucide-react date-fns mammoth

# ---------- source ----------
COPY src ./src
COPY public ./public

RUN chmod +x node_modules/.bin/next
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
RUN npm run build


# ---------- Step 2 : Runtime stage ----------
FROM node:22-alpine AS runner
WORKDIR /app

# runtime libs ???????? – ????????? dev headers ????
RUN echo "https://dl-cdn.alpinelinux.org/alpine/v$(cut -d. -f1,2 /etc/alpine-release)/community" \
        >> /etc/apk/repositories && \
    apk update && apk add --no-cache \
        libreoffice fontconfig ttf-freefont cairo pango pixman \
    && rm -rf /var/cache/apk/*

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
USER nextjs

ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
EXPOSE 3000
CMD ["npm","start"]
