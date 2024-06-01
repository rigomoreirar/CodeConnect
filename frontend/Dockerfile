# Use an official Node.js runtime as a parent image
FROM node:14

# Set work directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Debugging step to list contents of /app
RUN echo "Listing contents of /app after copying package.json:" && ls -la /app

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Debugging step to list contents of /app
RUN echo "Listing contents of /app after copying project files:" && ls -la /app

# Build the application
RUN npm run build

# Install serve
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Command to run the app
CMD ["serve", "-s", "build", "-l", "3000"]
