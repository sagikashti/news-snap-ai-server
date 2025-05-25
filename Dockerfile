FROM node:18-alpine as builder

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Production stage
FROM node:18-alpine as production

# Create app directory
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built code from builder stage
COPY --from=builder /app/dist ./dist

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -G nodejs

# Set ownership for the app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the port
EXPOSE 3000

# Start the server
CMD ["node", "dist/index.js"] 