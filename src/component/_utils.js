const Config = (function () {
  const configLive = require("../config-live.json");
  const configDev = require("../config.json");
  if (process.env.MODE == "LIVE") {
    return configLive;
  } else if (process.env.MODE == "DEV") {
    return configDev;
  }
})();

export default Config;