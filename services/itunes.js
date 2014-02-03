var Models, Service, async, iTunes, logger, mongo, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Service = require('./base');

mongo = require('../drivers/mongo');

_ = require('../lib/_');

async = require('async');

logger = require('../lib/logger');

Models = {
  activity: mongo.model('activity')
};

iTunes = (function(_super) {
  __extends(iTunes, _super);

  function iTunes() {
    this.api_base_url = "https://itunes.apple.com/lookup";
    this.api_is_json = true;
  }

  iTunes.prototype.fetch_recent_activity = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  iTunes.prototype.fetch_artist = function(artist_id, callback) {
    if (artist_id == null) {
      artist_id = null;
    }
    if (callback == null) {
      callback = function() {};
    }
    return this.api_call({
      url: "?id=" + artist_id
    }, function(err, body) {
      if (err) {
        return callback(err);
      }
      return callback(null, _.first(body.results));
    });
  };

  iTunes.prototype.fetch_albums_by_artist = function(artist_id, callback) {
    if (artist_id == null) {
      artist_id = null;
    }
    if (callback == null) {
      callback = function() {};
    }
    return this.api_call({
      url: "?id=" + artist_id + "&entity=album"
    }, function(err, body) {
      if (err) {
        return callback(err);
      }
      return callback(null, _.rest(body.results));
    });
  };

  iTunes.prototype.fetch_tracks_by_album = function(album_upc, callback) {
    if (album_upc == null) {
      album_upc = null;
    }
    if (callback == null) {
      callback = function() {};
    }
    return this.api_call({
      url: "?upc=" + album_upc + "&entity=song"
    }, function(err, body) {
      if (err) {
        return callback(err);
      }
      return callback(null, _.rest(body.results));
    });
  };

  return iTunes;

})(Service);

module.exports = new iTunes;
