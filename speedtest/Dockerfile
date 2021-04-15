FROM bitnami/node:12.22.1-prod

WORKDIR /src

COPY ./src .
RUN npm install

RUN apt-get update -y
RUN apt-get install -y gnupg1 apt-transport-https dirmngr iputils-ping
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 379CE192D401AB61
RUN echo "deb https://ookla.bintray.com/debian generic main" | tee /etc/apt/sources.list.d/speedtest.list
RUN apt-get update
RUN apt-get install speedtest

CMD ["node", "index.js"]
