# Use an official Node.js runtime as a parent image
FROM node:14

# Set work directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Verify that package.json was copied correctly (for debugging)
RUN ls -la /app

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Verify that project files are copied correctly (for debugging)
RUN ls -la /app

# Build the application
RUN npm run build

# Install serve
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Command to run the app
CMD ["serve", "-s", "build", "-l", "3000"]
