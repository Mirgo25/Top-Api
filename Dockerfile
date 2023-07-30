FROM node:14-alpine
WORKDIR /opt/app
# Initially install dependencies
# If package.json file does not change, dependencies will be pulled from cache
ADD package.json package.json
RUN npm install

ADD . .
RUN npm run build

# Remove "extraneous" packages
RUN npm prune --production

CMD [ "node", "./dist/main.js" ]