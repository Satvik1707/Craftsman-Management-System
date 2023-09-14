# Use the official Node.js image as the base
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the server application code
COPY . .

# Set the command to start the server
CMD ["npm", "start"]
