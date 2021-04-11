const LogUtils = {
  logObject: function (object) {
    console.log(JSON.stringify(object, function (key, value) {
      if (key === "_id") return undefined;
      return value
    }, 2));
  },
  log: function (...params) {
    console.log(...params);
  },
  error: function (...params) {
    console.error(...params);
  }
}

module.exports = { LogUtils }