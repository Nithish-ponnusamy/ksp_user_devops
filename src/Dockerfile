# Stage 1: Build React App
FROM node:18-alpine as build

WORKDIR /src

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the project
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
