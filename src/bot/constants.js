const packageJson = require("../../package.json");

const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;

module.exports = {
  APP_NAME: packageJson.name,
  VERSION: packageJson.version,
  WATCH_INTERVAL: 3 * ONE_MINUTE,
  CACHE_INTERVAL: 2 * ONE_MINUTE + 30 * ONE_SECOND,
};
