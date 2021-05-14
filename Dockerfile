# what image are we building from?
FROM node:latest

# Make a folder in your image where your app's source code can live
RUN mkdir -p ./docker

# Tell your container where your app's source code will live
WORKDIR ./server/index.js

# What source code do you what to copy, and where to put it?
COPY . ./docker

# Does your app have any dependencies that should be installed?
RUN yarn install

# What port will the container talk to the outside world with once created?
EXPOSE 3000

# How do you start your app?
CMD [ "npm", "start" ]