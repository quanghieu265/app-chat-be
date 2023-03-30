# syntax=docker/dockerfile:1

# define node version you will pull to docker , check version available in hub.docker.com/node
FROM node:18-alpine
WORKDIR /app
#  . . mean copy all the files from WORKDIR
COPY . .
RUN yarn install --production
CMD ["node", "index.js"]
# setup equal to  port using index.js file
EXPOSE 5000