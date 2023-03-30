# syntax=docker/dockerfile:1

# define node version you will pull to docker , check version available in hub.docker.com/node
FROM node:18-alpine
# Create app directory on Docker image

WORKDIR /app
#  . . mean copy all the files from WORKDIR
COPY . .
RUN yarn install --production
# cannot using Run to migrate DB before CMD ,because Performs migration during build step, not before Docker container is started
# RUN npx prisma migrate dev <- now WORK!! instead define migration in CMD - package json script
CMD [ "npm", "run", "start" ]
# setup equal to  port using index.js file
EXPOSE 5000