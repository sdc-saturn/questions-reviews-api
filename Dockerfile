# what image are we building from?
FROM node:latest

# Make a folder in your image where your app's source code can live
# RUN mkdir ./docker

# Tell your container where your app's source code will live
WORKDIR /app

# What source code do you what to copy, and where to put it?
COPY package*.json ./

# Does your app have any dependencies that should be installed?
RUN npm install
COPY . .
# What port will the container talk to the outside world with once created?
EXPOSE 3000

# How do you start your app?
CMD [ "npm", "start" ]