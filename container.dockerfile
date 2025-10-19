# Multi-Platform Dockerfile
# This file works on case-sensitive and case-insensitive systems

FROM node:18-alpine

# Install system dependencies
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy backend package files for dependency installation
COPY backend/package*.json ./

# Install only production dependencies
RUN npm ci --only=production --silent

# Copy backend application code
COPY backend/ .

# Copy frontend files for static serving
COPY frontend/ ./frontend/

# Create required directories
RUN mkdir -p ./frontend/assets/uploads

# Set environment variables
ENV NODE_ENV=production

# Expose port (will be set by platform)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start application
CMD ["node", "server.js"]