var LinkedIn, Service, async, config, logger, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Service = require('./base');

config = require('../config');

async = require('async');

_ = require('../lib/_');

logger = require('../lib/logger');

LinkedIn = (function(_super) {
  __extends(LinkedIn, _super);

  function LinkedIn() {}

  LinkedIn.prototype.fetch_recent_activity = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  LinkedIn.prototype.fetch_profile = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  LinkedIn.prototype.fetch_connections = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  LinkedIn.prototype.fetch_user = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  return LinkedIn;

})(Service);

module.exports = new LinkedIn;
