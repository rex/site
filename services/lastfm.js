var LastFM, LastFM_API, Models, Service, async, logger, mongo, _, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Service = require('./base');

mongo = require('../drivers/mongo');

_ = require('../lib/_');

async = require('async');

logger = require('../lib/logger');

LastFM_API = require('../apis/lastfm');

Models = {
  Activity: mongo.model('activity'),
  LastFM_Play: mongo.model('lastfm_play')
};

LastFM = (function(_super) {
  __extends(LastFM, _super);

  function LastFM() {
    _ref = LastFM.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  LastFM.prototype.initialize = function(initialized) {
    if (initialized == null) {
      initialized = function() {};
    }
    this.start_track_stream();
    return initialized();
  };

  LastFM.prototype.initialize_track_stream = function(track_stream_initialized) {
    if (track_stream_initialized == null) {
      track_stream_initialized = function() {};
    }
    this.track_stream = LastFM_API.client.stream(LastFM_API.config.username);
    this.track_stream.on('lastPlayed', function(track) {});
    this.track_stream.on('nowPlaying', function(track) {});
    this.track_stream.on('scrobbled', function(track) {
      return Models.LastFM_Play.createFromScrobble(track);
    });
    this.track_stream.on('stoppedPlaying', function(track) {});
    this.track_stream.on('error', function(err) {
      return console.error("Error in LastFM track stream", err);
    });
    return track_stream_initialized();
  };

  LastFM.prototype.start_track_stream = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    this.initialize_track_stream();
    this.track_stream.start();
    return callback();
  };

  LastFM.prototype.stop_track_stream = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    this.track_stream.stop();
    return callback();
  };

  LastFM.prototype.fetch_recent_tracks = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  LastFM.prototype.fetch_loved_tracks = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  LastFM.prototype.fetch_top_tracks = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  LastFM.prototype.fetch_top_albums = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  LastFM.prototype.fetch_top_artists = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  LastFM.prototype.fetch_top_tags = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  LastFM.prototype.fetch_friends = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  return LastFM;

})(Service);

module.exports = new LastFM;
