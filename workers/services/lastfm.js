var BaseWorker, LastFM, Models, Mongo, Queue, async, logger,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseWorker = require('../base');

Queue = require('../../drivers/queue');

Mongo = require('../../drivers/mongo');

logger = require('../../lib/logger');

async = require('async');

Models = {
  Activity: Mongo.model('activity'),
  LastFM_Scrobble: Mongo.model('lastfm_scrobble')
};

LastFM = (function(_super) {
  __extends(LastFM, _super);

  function LastFM() {
    return LastFM.__super__.constructor.apply(this, arguments);
  }

  LastFM.prototype.initialize = function(initialized) {
    if (initialized == null) {
      initialized = function() {};
    }
    this.queue_name = "service:lastfm";
    Queue.add_queue(this.queue_name);
    Queue.add_handlers(this.queue_name, {
      track_scrobbled: this.handle_scrobble,
      track_loved: this.handle_loved_track,
      track_banned: this.handle_banned_track,
      friend_added: this.handle_new_friend,
      shout_received: this.handle_shout
    });
    return initialized();
  };

  LastFM.prototype.handle_scrobble = function(track, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return async.waterfall([
      function(done) {
        return Models.LastFM_Scrobble.createFromScrobble(track.data, done);
      }, function(lastfm_scrobble, done) {
        return Models.Activity.create({
          created_on: lastfm_scrobble.created_on,
          redis_key: lastfm_scrobble.redis_id
        }, done);
      }
    ], callback);
  };

  LastFM.prototype.handle_loved_track = function(track, callback) {
    if (callback == null) {
      callback = function() {};
    }
    logger("Handling loved track");
    return callback();
  };

  LastFM.prototype.handle_banned_track = function(track, callback) {
    if (callback == null) {
      callback = function() {};
    }
    logger("Handling banned track");
    return callback();
  };

  LastFM.prototype.handle_new_friend = function(user, callback) {
    if (callback == null) {
      callback = function() {};
    }
    logger("Handling new friend");
    return callback();
  };

  LastFM.prototype.handle_shout = function(shout, callback) {
    if (callback == null) {
      callback = function() {};
    }
    logger("Handling shout");
    return callback();
  };

  return LastFM;

})(BaseWorker);

module.exports = new LastFM;
