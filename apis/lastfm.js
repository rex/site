var API, LastFM, LastFmNode, Models, async, logger, mongo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

LastFmNode = require('lastfm').LastFmNode;

async = require('async');

mongo = require('../drivers/mongo');

logger = require('../lib/logger');

API = require('./base');

Models = {
  Activity: mongo.model('activity'),
  LastFM_Play: mongo.model('lastfm_play')
};

LastFM = (function(_super) {
  __extends(LastFM, _super);

  function LastFM() {
    this.config = {
      api_key: process.env.LASTFM_API_KEY,
      api_secret: process.env.LASTFM_API_SECRET,
      username: process.env.LASTFM_USERNAME
    };
    this.client = new LastFmNode({
      api_key: this.config.api_key,
      secret: this.config.api_secret,
      useragent: 'prex.io'
    });
  }

  LastFM.prototype.recent_tracks = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  return LastFM;

})(API);

module.exports = new LastFM;
