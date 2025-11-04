FROM node:18-alpine AS build

WORKDIR /app

# Copy package manifests first to leverage Docker cache
COPY package*.json ./

# Install dependencies. Use npm ci for reproducible installs when lockfile exists.
# Add --legacy-peer-deps to match local behaviour if needed.
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; else npm install --legacy-peer-deps; fi

# Copy source and build
COPY . .
RUN npm run build

FROM nginx:stable-alpine AS final

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# If present, use the SPA-aware nginx config to ensure history-mode routes work.
COPY nginx.front.conf /etc/nginx/conf.d/default.conf

# Expose HTTP and add a simple healthcheck
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -qO- http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]