FROM harbor.mgmt.wells.gg/docker-proxy/node:20-slim

COPY . /app

WORKDIR /app

RUN npm install

ENV PORT="8080"
EXPOSE 8080

CMD [ "node", "server.js" ]