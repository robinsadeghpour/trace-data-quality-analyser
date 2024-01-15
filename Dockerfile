# Stage 1: Build the application
FROM node:18 as builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock if you're using yarn)
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Generate theme typings
RUN npm run gen:theme-typings

# Build the application
RUN npm run build

# Optionally, if you want to prune devDependencies after the build
RUN npm prune --production

# Stage 2: Setup the production environment
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy built artifacts from the builder stage
COPY --from=builder /app/dist/apps/backend ./dist/apps/backend
COPY --from=builder /app/dist/apps/frontend ./dist/apps/frontend

# Copy package.json and package-lock.json
COPY --from=builder /app/package*.json ./

# Copy any other files you need for runtime
# For example, if you have .env files or configurations needed, copy them here

# Install only production dependencies
# This step might be redundant if you already pruned in the previous stage
RUN npm install --only=production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/apps/backend/main.js"]
