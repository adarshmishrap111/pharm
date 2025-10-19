# Production Dockerfile for Pharmida
FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json from backend
COPY backend/package*.json ./

# Install production dependencies only
RUN npm ci --only=production --silent && npm cache clean --force

# Copy application source
COPY backend/ .

# Copy frontend files (served by Express static)
COPY frontend/ ./frontend/

# Create uploads directory
RUN mkdir -p ./frontend/assets/uploads

# Expose the port
EXPOSE $PORT

# Set production environment
ENV NODE_ENV=production

# Start the application directly with node (not npm)
CMD ["node", "server.js"]