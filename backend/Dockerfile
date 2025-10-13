# Development stage
FROM node:18-alpine

WORKDIR /app

# Install dumb-init and openssl for Prisma
RUN apk add --no-cache dumb-init openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including devDependencies for ts-node)
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Create uploads directory for media files
RUN mkdir -p /app/uploads

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start server with ts-node (development mode)
# Skip migrations since database is already set up
CMD ["npx", "ts-node", "src/index.ts"]
