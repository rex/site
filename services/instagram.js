var Instagram, Instagram_API, Models, Service, async, logger, mongo, _, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Service = require('./base');

mongo = require('../drivers/mongo');

_ = require('../lib/_');

async = require('async');

logger = require('../lib/logger');

Instagram_API = require('../apis/instagram');

Models = {
  activity: mongo.model('activity')
};

Instagram = (function(_super) {
  __extends(Instagram, _super);

  function Instagram() {
    _ref = Instagram.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Instagram.prototype.fetch_recent_activity = function(callback) {
    return async.parallel({
      likes: this.fetch_recent_likes,
      images: this.fetch_images
    }, callback);
  };

  Instagram.prototype.fetch_recent_likes = function(callback) {
    return Instagram_API.users.liked_by_self({
      complete: function(data) {
        return callback(null, data);
      }
    });
  };

  Instagram.prototype.fetch_images = function(callback) {
    var current_pagination, images;
    current_pagination = {};
    images = [];
    return async.doWhilst(function(done) {
      logger("Fetching Instagram activity", current_pagination);
      return Instagram_API.users.recent({
        user_id: 11843229,
        max_id: current_pagination.next_max_id != null ? current_pagination.next_max_id : null,
        complete: function(data, pagination) {
          current_pagination = pagination;
          return async.each(data, function(image, next) {
            logger("Processing image " + image.id);
            images.push(image);
            return Models.activity.findOneAndUpdate({
              'service': 'Instagram_API',
              'params.id': image.id
            }, {
              $set: {
                created_on: parseInt(image.created_time * 1000),
                service: 'Instagram_API',
                type: 'share',
                params: image
              }
            }, {
              upsert: true
            }, next);
          }, done);
        }
      });
    }, function() {
      logger("Checking pagination: ", current_pagination);
      return _.has(current_pagination, "next_url");
    }, callback);
  };

  Instagram.prototype.process_webhook_activity = function(body, callback) {};

  return Instagram;

})(Service);

module.exports = new Instagram;
