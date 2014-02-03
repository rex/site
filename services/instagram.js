var Instagram, Models, Service, UID, async, config, logger, mongo, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Service = require('./base');

mongo = require('../drivers/mongo');

_ = require('../lib/_');

async = require('async');

logger = require('../lib/logger');

config = require('../config');

UID = config.instagram.user_id;

Models = {
  activity: mongo.model('activity')
};

Instagram = (function(_super) {
  __extends(Instagram, _super);

  function Instagram() {
    this.api_config = {
      client_id: process.env.INSTAGRAM_CLIENT_ID,
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
      access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
      user_id: process.env.INSTAGRAM_USER_ID
    };
    this.client = require('instagram-node-lib');
    this.client.set('client_id', this.api_config.client_id);
    this.client.set('client_secret', this.api_config.client_secret);
    this.client.set('access_token', this.api_config.access_token);
  }

  Instagram.prototype.fetch_recent_activity = function(callback) {
    return async.parallel({
      likes: this.fetch_recent_likes,
      images: this.fetch_images
    }, callback);
  };

  Instagram.prototype.fetch_recent_likes = function(callback) {
    return this.client.users.liked_by_self({
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
      return this.client.users.recent({
        user_id: UID,
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

  Instagram.prototype.fetch_user = function(user_id, callback) {
    if (user_id == null) {
      user_id = UID;
    }
    if (callback == null) {
      callback = function() {};
    }
    return this.client.users.info({
      user_id: user_id,
      complete: function(data, pagination) {
        return callback(null, data);
      }
    });
  };

  Instagram.prototype.fetch_user_feed = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.client.something;
  };

  Instagram.prototype.fetch_media_by_user = function(user_id, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.client.something({
      user_id: UID,
      complete: function(data, pagination) {
        return callback(null, data);
      }
    });
  };

  Instagram.prototype.fetch_likes_by_user = function(user_id, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.client.something({
      user_id: UID,
      complete: function(data, pagination) {
        return callback(null, data);
      }
    });
  };

  Instagram.prototype.fetch_follows_by_user = function(user_id, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.client.something({
      user_id: UID,
      complete: function(data, pagination) {
        return callback(null, data);
      }
    });
  };

  Instagram.prototype.fetch_followers_by_user = function(user_id, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.client.something({
      user_id: UID,
      complete: function(data, pagination) {
        return callback(null, data);
      }
    });
  };

  Instagram.prototype.fetch_follow_requests_by_user = function(user_id, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.client.something({
      user_id: UID,
      complete: function(data, pagination) {
        return callback(null, data);
      }
    });
  };

  Instagram.prototype.fetch_media = function(media_id, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.client.something({
      user_id: UID,
      complete: function(data, pagination) {
        return callback(null, data);
      }
    });
  };

  Instagram.prototype.fetch_comments_by_media = function(media_id, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.client.something({
      user_id: UID,
      complete: function(data, pagination) {
        return callback(null, data);
      }
    });
  };

  Instagram.prototype.fetch_likes_by_media = function(media_id, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.client.something({
      user_id: UID,
      complete: function(data, pagination) {
        return callback(null, data);
      }
    });
  };

  Instagram.prototype.process_webhook_activity = function(body, callback) {};

  return Instagram;

})(Service);

module.exports = new Instagram;
