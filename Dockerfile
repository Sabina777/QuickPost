# Use Node.js 18 Alpine image (lightweight)
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of your app's source code
COPY . .

# Expose port 5000
EXPOSE 5000

# Run the app
CMD ["npm", "start"]
