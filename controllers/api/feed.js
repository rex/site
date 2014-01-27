var Models, Mongo, Redis, async, logger, _;

Mongo = require('../../drivers/mongo');

Redis = require('../../drivers/redis');

_ = require('../../lib/_');

logger = require('../../lib/logger');

async = require('async');

Models = {
  Activity: Mongo.model('activity')
};

module.exports = function(app) {
  return app.get('/feed', function(req, res) {
    var skip;
    skip = 0;
    if (_.isNumber(parseInt(req.query.page)) && req.query.page > 1) {
      skip = (req.query.page - 1) * 20;
    }
    return Models.Activity.find().sort({
      created_on: 'desc'
    }).skip(skip).limit(20).exec(function(err, activities) {
      return async.map(activities, function(activity, done) {
        return Redis.get_model(activity.redis_key, function(error, data) {
          data = _.extend(data, {
            redis_key: activity.redis_key
          });
          return done(error, data);
        });
      }, function(err, formatted) {
        return res.json({
          err: err,
          activities: formatted
        });
      });
    });
  });
};
