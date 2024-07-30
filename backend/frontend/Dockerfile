# Stage 1: Build the React application
FROM node:14 as build

# Set work directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Setup Nginx
FROM nginx:latest

# Copy the built React files from the previous stage to the Nginx HTML folder
COPY --from=build /app/build /usr/share/nginx/html

# Copy Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy SSL certificates
COPY codeconnect.crt /etc/ssl/codeconnect.crt
COPY codeconnect.key /etc/ssl/codeconnect.key

# Expose port 80 and 443
EXPOSE 80
EXPOSE 443

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
