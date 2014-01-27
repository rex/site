var Service, Soundcloud, async, config, logger, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Service = require('./base');

config = require('../config');

async = require('async');

_ = require('../lib/_');

logger = require('../lib/logger');

Soundcloud = (function(_super) {
  __extends(Soundcloud, _super);

  function Soundcloud() {}

  Soundcloud.prototype.fetch_recent_activity = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  Soundcloud.prototype.fetch_profile = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  Soundcloud.prototype.fetch_connections = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  Soundcloud.prototype.fetch_activities = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  Soundcloud.prototype.fetch_playlists = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  Soundcloud.prototype.fetch_tracks = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  Soundcloud.prototype.fetch_comments = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  Soundcloud.prototype.fetch_favorites = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  Soundcloud.prototype.fetch_followers = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  Soundcloud.prototype.fetch_followings = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  Soundcloud.prototype.fetch_user = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  return Soundcloud;

})(Service);

module.exports = new Soundcloud;
