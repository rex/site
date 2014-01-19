var Models, async, github, logger, mongoose, _;

github = require('../../lib/github');

logger = '../../logger';

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
      return github.activity(function(err, body) {
        if (err) {
          return done(err);
        }
        return _.each(body, function(activity) {});
      });
    }
  }, function(err, results) {
    if (err) {
      return res.json(500, {
        err: err
      });
    } else {
      return res.json({
        results: results
      });
    }
  });
};
