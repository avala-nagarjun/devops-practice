# 1. Use an official Node.js runtime as a parent image
# "alpine" is a super small Linux distribution (5MB)
FROM node:25-alpine3.22

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json FIRST
# This is "Layer Caching". If dependencies don't change, Docker skips `npm install`
COPY package*.json ./
# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the application code
COPY . .
# 6. Expose the port the app runs on
EXPOSE 5000

# 7. Define the command to run the app
CMD ["node", "index.js"]
