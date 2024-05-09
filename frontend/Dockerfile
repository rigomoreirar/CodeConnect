# Use an official Node.js runtime as a parent image for the build stage
FROM node:14 as build

# Set work directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy project
COPY . .

# Build the application
RUN npm run build

# Use an official lightweight Node.js runtime as a parent image for the runtime stage
FROM node:14-alpine

# Set work directory
WORKDIR /app

# Install serve to run the application
RUN npm install -g serve

# Copy build files from the build stage
COPY --from=build /app/build .

# Expose port
EXPOSE 5000

# Run the application
CMD ["serve", "-s", ".", "-l", "5000"]