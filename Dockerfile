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

# Start Next.js app
CMD ["npm", "run", "start"]

