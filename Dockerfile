# Stage 1: Build React App
FROM node:20.18.0 AS build

WORKDIR /app

# Copy only package.json files for caching
COPY ./front-end/package.json ./front-end/package-lock.json ./front-end/


# Install dependencies for React
RUN cd ./front-end && npm install

# Copy React source files and build
COPY ./front-end ./front-end
RUN cd ./front-end && npm run build

# Stage 2: Setup Express Server
FROM node:20-alpine AS server

WORKDIR /app

# Copy package.json and install production dependencies
COPY ./package.json ./package-lock.json ./
RUN npm install --production

# Copy the server files
COPY ./*.js ./  
COPY ./back-end ./back-end
# Adjust if you have other server files

# Copy built React app from the previous stage
COPY --from=build /app/front-end/dist ./front-end/dist

# Set NODE_ENV to production
ENV NODE_ENV=production
ENV omit=dev
ENV PORT=8888
# Expose port
EXPOSE 8888

# Start the server
CMD ["node", "server.js"]
