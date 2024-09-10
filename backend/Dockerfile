# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 3001 (or whichever port your app uses)
EXPOSE 3001

# Set environment variables (if needed)
# ENV NODE_ENV=production

# Command to run your application
CMD ["node", "index.js"]
