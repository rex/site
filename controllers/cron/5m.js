var Services, async, logger;

logger = require('../../lib/logger');

async = require('async');

Services = {
  Github: require('../../services/github')
};

module.exports = function() {
  logger("Cron running: 5m");
  return async.parallel({
    github_activity: function(done) {
      return Services.Github.fetch_recent_activity(done);
    }
  }, function(err, results) {
    if (err) {
      return logger.error(err);
    } else {
      return logger("5m cron complete!", results);
    }
  });
};
