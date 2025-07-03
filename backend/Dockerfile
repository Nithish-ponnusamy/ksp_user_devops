# Use Node Alpine for lightweight backend image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json first
COPY package*.json ./

# Install dependencies inside container
RUN npm install

# Copy project files
COPY . .

# Expose port
EXPOSE 5000

# Start app
CMD ["npm", "start"]
