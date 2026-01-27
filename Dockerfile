# ================================
# DSA Study Hub - Dockerfile
# Multi-stage build for production
# ================================

# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy frontend package files
COPY package*.json ./

# Install frontend dependencies
RUN npm ci --only=production=false

# Copy frontend source files
COPY . .

# Build the frontend
RUN npm run build

# ================================
# Stage 2: Setup the backend
FROM node:20-alpine AS backend-builder

WORKDIR /app/server

# Copy server package files
COPY server/package*.json ./

# Install backend dependencies (production only)
RUN npm ci --only=production

# ================================
# Stage 3: Production image
FROM node:20-alpine AS production

# Add labels for better maintainability
LABEL maintainer="toxicbishop"
LABEL description="DSA Study Hub - A comprehensive DSA learning platform"
LABEL version="1.0.0"

# Set environment to production
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy built frontend from frontend-builder stage
COPY --from=frontend-builder /app/dist ./dist

# Copy server files
COPY server/index.js ./server/
COPY server/models ./server/models

# Copy backend node_modules from backend-builder stage
COPY --from=backend-builder /app/server/node_modules ./server/node_modules

# Copy environment example file (user should provide actual .env)
COPY server/.env.example ./server/.env.example

# Set the working directory to server
WORKDIR /app/server

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the port the server runs on
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))" || exit 1

# Start the server
CMD ["node", "index.js"]
