# ---------- Build stage ----------
FROM node:24-trixie-slim AS build

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build TypeScript
RUN npm run build

# ---------- Runtime stage ----------
FROM node:24-trixie-slim

WORKDIR /usr/src/app

# Copy package files again
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built output from build stage
COPY --from=build /usr/src/app/dist ./dist

# Expose app port
EXPOSE 8080

# Start production server
CMD ["npm", "run", "start"]