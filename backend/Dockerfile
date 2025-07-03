# Use Node Alpine for lightweight backend image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port (adjust based on your backend app)
EXPOSE 5000

# Start the backend
CMD ["npm", "start"]
