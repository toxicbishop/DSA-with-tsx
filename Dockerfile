FROM node:22-alpine AS base
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy all necessary files
COPY . .

# Build Next.js app
RUN npm run build

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Expose Next.js port
EXPOSE 3000

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy built frontend from frontend-builder stage
COPY --from=frontend-builder /app/dist ./dist

# Copy server files
COPY server/index.js ./server/

# Install compilers and runtimes for code execution (C, C++, Python, Java)
USER root
RUN apk add --no-cache build-base python3 openjdk21

COPY server/models ./server/models
COPY server/routes ./server/routes
COPY server/middleware ./server/middleware
COPY server/utils ./server/utils


# Copy backend node_modules from backend-builder stage
COPY --from=backend-builder /app/server/node_modules ./server/node_modules

# Copy environment example file (user should provide actual .env)
# COPY server/.env.example ./server/.env.example

# Set the working directory to server
WORKDIR /app/server

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the port the server runs on
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))" || exit 1

# Start the server
CMD ["node", "index.js"]

