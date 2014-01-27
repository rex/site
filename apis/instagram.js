var API, Instagram, Models, async, instagram_lib, logger, mongo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

instagram_lib = require('instagram-node-lib');

async = require('async');

mongo = require('../drivers/mongo');

logger = require('../lib/logger');

API = require('./base');

Models = {
  activity: mongo.model('activity')
};

Instagram = (function(_super) {
  __extends(Instagram, _super);

  function Instagram() {
    this.config = {
      client_id: process.env.INSTAGRAM_CLIENT_ID,
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
      access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
      user_id: process.env.INSTAGRAM_USER_ID
    };
    this.client = instagram_lib;
    this.client.set('client_id', this.config.client_id);
    this.client.set('client_secret', this.config.client_secret);
    this.client.set('access_token', this.config.access_token);
  }

  Instagram.prototype.recent_images = function(callback) {};

  Instagram.prototype.all_images = function(callback) {};

  Instagram.prototype.recent_likes = function(callback) {};

  Instagram.prototype.all_likes = function(callback) {};

  return Instagram;

})(API);

module.exports = new Instagram;
