# Use Node.js official image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (omit dev deps for smaller image)
RUN npm ci --omit=dev

# Create uploads directory (for file storage)
RUN mkdir -p uploads

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nodejs -u 1001

# Copy source code
COPY . .

# Change ownership of the app directory to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the port used by the app
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
