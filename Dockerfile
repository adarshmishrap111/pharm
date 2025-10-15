FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production 2>/dev/null || npm install --only=production

# Copy app source
COPY . .

# Ensure uploads directory exists
RUN mkdir -p assets/uploads

EXPOSE 3000

CMD [ "node", "server.js" ]
