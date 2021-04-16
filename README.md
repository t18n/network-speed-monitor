# Network Speed Monitor Docker

A network speed monitoring stack that built with InfluxDB, Grafana and Speedtest CLI

## Prerequisite
- Docker & Docker-compose installed
- Git installed

## Getting started
- Clone this repo
- Update `.env` file following the guide below
- Run `docker-compose up -d`
- Visit `http://localhost:<GRAFANA_PORT>` to view the statistics. The default credentials are `admin:admin`, Grafana will ask you to change your password the first time

## Update env file
- Run `cp .env.sample .env` and change the environment variables as you wish in `.env`
- Get `SPEEDTEST_SERVER_ID` value from [this link](https://sparanoid.com/lab/speedtest-list/)
- Config `CRON_CONFIG` following [node-cron syntax](https://www.npmjs.com/package/node-cron). I recommend to start with 1 minute to see the first few test quickly, then finally increase it to your desired time. Personally, I use `1 * * * *` (each hour) as I think it would be more than enough. Every time you change the `.env` file, run `docker-compose up -d --build` to rebuild the image.

## Showcase
![](./screenshots/Network-Speedtest.jpg)