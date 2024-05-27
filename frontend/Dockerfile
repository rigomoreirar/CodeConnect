# Use an official Node.js runtime as a parent image for the build stage
FROM node:14 as build
# Set work directory
WORKDIR /app
# Install dependencies
COPY package*.json ./
RUN npm ci
# Copy project files
COPY . .
# Build the application
RUN npm run build
# Use an official Nginx runtime as a parent image for the runtime stage
FROM nginx:alpine
# Remove default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf
# Copy build files from the build stage
COPY --from=build /app/build /usr/share/nginx/html
# Copy custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80
EXPOSE 80
# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]