# Use official lightweight Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency manifests first for Docker layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production || npm install --production

# Copy application source code
COPY . .

# Expose server port (default 3000)
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start Aethera server
CMD ["node", "Backend/server.js"]
