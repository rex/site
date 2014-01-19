var logger;

logger = require('../lib/logger');

module.exports = function(app) {
  return app.post('/cron', function(req, res) {
    var interval;
    if (!req.body.interval) {
      return logger.error("No cron interval specified");
    }
    interval = req.body.interval.toString();
    if (interval === '5m' || interval === '15m' || interval === '1h' || interval === '12h' || interval === '24h' || interval === '7d' || interval === '30d') {
      require("./cron/" + interval)();
    } else {
      logger.error("Invalid cron attempted: " + interval);
    }
    return res.send(200);
  });
};
