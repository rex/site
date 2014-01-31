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

  Twitter.prototype.fetch_following = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.client.get('friends/list', {}, callback);
  };

  Twitter.prototype.fetch_followers = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.client.get('followers/list', {}, callback);
  };

  Twitter.prototype.fetch_mentions = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.client.get('statuses/mentions_timeline', {}, callback);
  };

  Twitter.prototype.fetch_retweets = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.client.get('statuses/retweets_of_me', {}, callback);
  };

  Twitter.prototype.fetch_blocks = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.client.get('blocks/list', {}, callback);
  };

  Twitter.prototype.fetch_settings = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.client.get('account/settings', {}, callback);
  };

  Twitter.prototype.fetch_favorites = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.client.get('favorites/list', {}, callback);
  };

  Twitter.prototype.fetch_lists = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.client.get('lists/list', {}, callback);
  };

  Twitter.prototype.fetch_list_memberships = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.client.get('lists/memberships', {}, callback);
  };

  Twitter.prototype.fetch_media = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.client.get('search/tweets', {
      q: 'from:kiapierce filter:links'
    }, callback);
  };

  return Twitter;

})(Service);

module.exports = new Twitter;
