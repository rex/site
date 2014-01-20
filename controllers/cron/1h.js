var Services, async, logger;

logger = require('../../lib/logger');

async = require('async');

Services = {
  Github: require('../../services/github'),
  Instagram: require('../../services/instagram')
};

module.exports = function() {
  logger("Cron running: 1h");
  return async.parallel({
    github_repos: function(done) {
      return Services.Github.fetch_repos(done);
    },
    instagram_images: function(done) {
      return Services.Instagram.fetch_recent_activity(done);
    }
  }, function(err, results) {
    if (err) {
      return logger.error(err);
    } else {
      return logger("Successfully completed 1h cron");
    }
  });
};
