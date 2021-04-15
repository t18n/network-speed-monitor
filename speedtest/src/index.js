const execa = require("execa");
const Influx = require("influx");
const cron = require('node-cron');

/**
 * Convert Bytes to Megabit
 */
const convertBytesToMbps = bytes => {
  const KB = bytes / 1000;
  const MB = KB / 1000;
  const Mb = MB * 8;
  return Mb;
};

/**
 * Get speedtest data in json format
 */
const getSpeedData = async () => {
  const speedtestArgs = ["--accept-license", "--accept-gdpr", "--format=json"];

  if (process.env.SPEEDTEST_SERVER_ID) {
    speedtestArgs.push(`--server-id=${process.env.SPEEDTEST_SERVER_ID}`);
  }

  const { stdout } = await execa("speedtest", speedtestArgs);
  const result = JSON.parse(stdout);

  return {
    upload: convertBytesToMbps(result.upload.bandwidth),
    download: convertBytesToMbps(result.download.bandwidth),
    ping: result.ping.latency,
    isp: result.isp,
    ip: result.interface.internalIp,
    myExternalIp: result.interface.externalIp,
    myRequestServerId: result.server.id,
    requestServerName: result.server.name,
    requestServerLocation: `${result.server.location} - ${result.server.country}`,
  };
};

/**
 * Write to influx
 */
const writeToDB = async (influx, metrics) => {
  const points = Object.entries(metrics).map(([measurement, value]) => ({
    measurement,
    tags: { host: process.env.SPEEDTEST_HOST },
    fields: { value }
  }));

  await influx.writePoints(points);
};

/**
 * Perform the speedtest
 */
const runSpeedTest = async () => {
  try {
    const influx = new Influx.InfluxDB({
      host: 'localhost',
      database: process.env.INFLUXDB_DB,
      username: process.env.INFLUXDB_ADMIN_USER,
      password: process.env.INFLUXDB_ADMIN_PASSWORD,
    });

    const speedMetrics = await getSpeedData();
    console.log(`Speedtest results ${speedMetrics.timestamp}`);
    console.table(speedMetrics);
    await writeToDB(influx, speedMetrics);
  } catch (err) {
    console.error(`Speedtest error: ${err.message}`);
    process.exit(1);
  }

  console.log('Completed speed test successfully!');
   process.exit(1);
};

/**
 * Start cron job
 */
cron.schedule(process.env.CRON_CONFIG, () => {
  console.log(`${new Date().toISOString()} - Start speed test`);
  runSpeedTest();
});
