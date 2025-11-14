# Build stage for frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source
COPY . .

# Build frontend
RUN npm run build

# Build stage for backend
FROM node:20-alpine AS backend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy backend source
COPY server ./server
COPY .env* ./

# Build backend TypeScript
RUN npm run build:server

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built frontend from frontend-builder
COPY --from=frontend-builder /app/dist ./dist

# Copy built backend from backend-builder
COPY --from=backend-builder /app/server/dist ./server/dist
COPY --from=backend-builder /app/server/entity ./server/entity
COPY --from=backend-builder /app/server/config ./server/config
COPY --from=backend-builder /app/server/utils ./server/utils
COPY --from=backend-builder /app/server/middleware ./server/middleware
COPY --from=backend-builder /app/server/controllers ./server/controllers
COPY --from=backend-builder /app/server/routes ./server/routes
COPY --from=backend-builder /app/server/dto ./server/dto

# Copy environment files
COPY .env* ./

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["npm", "run", "server"]
