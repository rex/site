var Models, async, github, logger, mongoose, _;

github = require('../../lib/github');

logger = require('../../lib/logger');

_ = require('../../lib/_');

mongoose = require('mongoose');

async = require('async');

Models = {
  activity: mongoose.model('activity')
};

module.exports = function() {
  logger("Cron running: 5m");
  return async.parallel({
    github_activity: function(done) {
      logger("Processing recent github activity...");
      return github.events(function(err, body) {
        if (err) {
          return done(err);
        }
        _.each(body, function(activity) {
          return logger("Processing activity #" + activity.id);
        });
        return done();
      });
    }
  }, function(err, results) {
    if (err) {
      return logger.error(err);
    } else {
      return logger("5m cron complete!", results);
    }
  });
};
