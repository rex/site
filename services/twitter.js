var Service, Twitter, config, twit, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

twit = require('twit');

config = require('../config');

Service = require('./base');

Twitter = (function(_super) {
  __extends(Twitter, _super);

  function Twitter() {
    _ref = Twitter.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Twitter.prototype.initialize = function(done) {
    return this.client = new twit(config.twitter);
  };

  Twitter.prototype.fetch_recent_activity = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  Twitter.prototype.fetch_timeline = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.client.get('statuses/user_timeline', {}, callback);
  };

  return Twitter;

})(Service);

module.exports = new Twitter;
