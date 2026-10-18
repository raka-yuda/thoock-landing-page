FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_UMAMI_SCRIPT_URL=""
ARG VITE_UMAMI_WEBSITE_ID=""
RUN VITE_UMAMI_SCRIPT_URL="$VITE_UMAMI_SCRIPT_URL" VITE_UMAMI_WEBSITE_ID="$VITE_UMAMI_WEBSITE_ID" npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s CMD wget -q -O /dev/null http://127.0.0.1:8080/health || exit 1
