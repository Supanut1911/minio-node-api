# Dockerfile
# Build
FROM node:14-alpine AS builder

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
# RUN npm install rimraf -g
# RUN npm install ts-node
# RUN npm install typescript

ENV NODE_ENV=production
RUN npm run build
#RUN mkdir dist && babel src -s -d dist --copy-files

# Package
FROM builder AS production
ENV NODE_ENV=production
# RUN apk add curl
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist .
# RUN npm uninstall rimraf, ts-node, typescript 

ENTRYPOINT [ "npm", "start" ]
