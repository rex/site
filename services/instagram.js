var Instagram, Models, Service, async, instagram, logger, mongoose, _, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Service = require('./base');

mongoose = require('mongoose');

instagram = require('../lib/instagram');

_ = require('../lib/_');

async = require('async');

logger = require('../lib/logger');

Models = {
  activity: mongoose.model('activity')
};

Instagram = (function(_super) {
  __extends(Instagram, _super);

  function Instagram() {
    _ref = Instagram.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Instagram.prototype.fetch_recent_activity = function(callback) {
    var current_pagination, images;
    current_pagination = {};
    images = [];
    return async.doWhilst(function(done) {
      logger("Fetching Instagram activity", current_pagination);
      return instagram.users.recent({
        user_id: 11843229,
        max_id: current_pagination.next_max_id != null ? current_pagination.next_max_id : null,
        complete: function(data, pagination) {
          current_pagination = pagination;
          return async.each(data, function(image, next) {
            logger("Processing image " + image.id);
            images.push(image);
            return Models.activity.findOne({
              'service': 'instagram',
              'params.id': image.id
            }, function(err, existing_image) {
              var new_image;
              if (err) {
                return next(err);
              }
              if (existing_image) {
                return Models.activity.findOneAndUpdate({
                  'service': 'instagram',
                  'params.id': image.id
                }, {
                  $set: {
                    params: image
                  }
                }, next);
              } else {
                new_image = new Models.activity({
                  created_on: parseInt(image.created_time * 1000),
                  service: 'instagram',
                  type: 'share',
                  params: image
                });
                return new_image.save(next);
              }
            });
          }, function(err) {
            return done(err);
          });
        }
      });
    }, function() {
      logger("Checking pagination: ", current_pagination);
      return _.has(current_pagination, "next_url");
    }, function(err) {
      logger("All done!", err, "" + images.length + " images processed");
      return callback(err, images);
    });
  };

  Instagram.prototype.process_webhook_activity = function(body, callback) {};

  return Instagram;

})(Service);

module.exports = new Instagram;
