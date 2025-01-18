# Use the Node.js LTS image
FROM node:22

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Install Hoarder CLI globally
RUN npm install -g @hoarderapp/cli

# Expose the application port
EXPOSE 3091

# Start the application
CMD ["node", "index.js"]
