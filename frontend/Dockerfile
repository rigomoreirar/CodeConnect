# Use an official Node.js runtime as a parent image
FROM node:14

# Set work directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Install serve
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Command to run the app
CMD ["serve", "-s", "build", "-l", "3000"]
