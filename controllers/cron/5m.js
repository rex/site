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
        var activity_ids;
        if (err) {
          return done(err);
        }
        activity_ids = _.pluck(body, "id");
        logger("Checking activity IDs", activity_ids);
        return Models.activity.find({
          service: "github",
          'params.id': {
            '$in': activity_ids
          }
        }, function(err, existing_activities) {
          var new_activities, old_activities;
          old_activities = _.map(existing_activities, function(old_activity) {
            return old_activity.params.id;
          });
          logger("Old activities found: ", old_activities);
          new_activities = _.difference(activity_ids, old_activities);
          logger("New activities found", new_activities);
          return async.each(new_activities, function(activity_id, next) {
            var Activity, activity;
            logger("Processing activity #" + activity_id);
            activity = _.findWhere(body, {
              id: activity_id
            });
            Activity = new Models.activity({
              service: 'github',
              created_on: activity.created_at,
              type: activity.type,
              params: activity
            });
            return Activity.save(next);
          }, function(err) {
            return done(err);
          });
        });
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
