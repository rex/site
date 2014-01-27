var BaseWorker, LastFM, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseWorker = require('../base');

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
  };

  LastFM.prototype.handle_scrobble = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  LastFM.prototype.handle_loved_track = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  LastFM.prototype.handle_banned_track = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  LastFM.prototype.handle_new_friend = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  LastFM.prototype.handle_shout = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  return LastFM;

})(BaseWorker);

module.exports = new LastFM;
