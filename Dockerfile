# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm install
RUN cd frontend && npm install
RUN cd backend && npm install

# Copy source code
COPY . .

# Build frontend
RUN cd frontend && npm run build

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]