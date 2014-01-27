var BaseWorker, LastFM, Models, Mongo, Queue, async, logger, _ref,
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
    _ref = LastFM.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  LastFM.prototype.initialize = function(initialized) {
    if (initialized == null) {
      initialized = function() {};
    }
    this.queue_name = "service:lastfm";
    Queue.add_queue(this.queue_name);
    Queue.add_handler({
      queue_name: this.queue_name,
      job_name: 'track_scrobbled',
      handler: this.handle_scrobble
    });
    Queue.add_handler({
      queue_name: this.queue_name,
      job_name: 'track_loved',
      handler: this.handle_loved_track
    });
    Queue.add_handler({
      queue_name: this.queue_name,
      job_name: 'track_banned',
      handler: this.handle_banned_track
    });
    Queue.add_handler({
      queue_name: this.queue_name,
      job_name: 'friend_added',
      handler: this.handle_new_friend
    });
    Queue.add_handler({
      queue_name: this.queue_name,
      job_name: 'shout_received',
      handler: this.handle_shout
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
          redis_key: "service:lastfm:scrobble:" + lastfm_scrobble._id
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
