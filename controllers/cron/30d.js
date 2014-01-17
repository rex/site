var logger;

logger = require('../../lib/logger');

module.exports = function() {
  return logger("Cron running: 30d");
};
