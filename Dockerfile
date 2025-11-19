# Build stage for frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with cache optimization
RUN npm ci --prefer-offline --no-audit

# Copy frontend source
COPY tsconfig*.json vite.config.ts tailwind.config.js postcss.config.js ./
COPY src ./src
COPY public ./public
COPY index.html ./

# Build frontend
RUN npm run build

# Build stage for backend
FROM node:20-alpine AS backend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with cache optimization
RUN npm ci --prefer-offline --no-audit

# Copy backend source
COPY server ./server

# Build backend TypeScript
RUN npm run build:server

# Production stage
FROM node:20-alpine

# Set production environment
ENV NODE_ENV=production

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production --prefer-offline --no-audit && \
    npm cache clean --force

# Copy built frontend from frontend-builder
COPY --from=frontend-builder --chown=nodejs:nodejs /app/dist ./dist

# Copy built backend from backend-builder
COPY --from=backend-builder --chown=nodejs:nodejs /app/server/dist ./server/dist
COPY --from=backend-builder --chown=nodejs:nodejs /app/server/entity ./server/entity
COPY --from=backend-builder --chown=nodejs:nodejs /app/server/config ./server/config
COPY --from=backend-builder --chown=nodejs:nodejs /app/server/utils ./server/utils
COPY --from=backend-builder --chown=nodejs:nodejs /app/server/middleware ./server/middleware
COPY --from=backend-builder --chown=nodejs:nodejs /app/server/controllers ./server/controllers
COPY --from=backend-builder --chown=nodejs:nodejs /app/server/routes ./server/routes
COPY --from=backend-builder --chown=nodejs:nodejs /app/server/dto ./server/dto
COPY --from=backend-builder --chown=nodejs:nodejs /app/server/migrations ./server/migrations
COPY --from=backend-builder --chown=nodejs:nodejs /app/server/data-source.ts ./server/data-source.ts

# Create logs and data directories with proper permissions
RUN mkdir -p logs data && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check with improved timing
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server with proper signal handling
CMD ["node", "server/dist/index.js"]
