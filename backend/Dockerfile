# Use Node Alpine for lightweight backend image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy backend source code
COPY . .

# Expose port if your backend listens on one (e.g., 5000)
EXPOSE 5000

# Start the backend
CMD ["node", "server.js"]
