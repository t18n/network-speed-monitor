FROM bitnami/node:12.22.1-prod

WORKDIR /src

COPY ./src .
RUN npm install

RUN apt-get update -y
RUN apt-get install -y gnupg1 apt-transport-https dirmngr iputils-ping
RUN curl -s https://install.speedtest.net/app/cli/install.deb.sh | bash
RUN apt-get update
RUN apt-get install speedtest

CMD ["node", "index.js"]
