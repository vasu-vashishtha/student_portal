# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
# Use npm ci when lockfile exists, fallback to npm install otherwise
RUN npm ci || npm install

# Copy source
COPY . .

# Accept build-time environment variables for Vite
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
ARG VITE_UPLOADS_BASE_URL
ENV VITE_UPLOADS_BASE_URL=${VITE_UPLOADS_BASE_URL}

# Build static assets
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config for SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
