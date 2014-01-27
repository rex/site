var Evernote, Service, async, config, logger, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Service = require('./base');

config = require('../config');

async = require('async');

_ = require('../lib/_');

logger = require('../lib/logger');

Evernote = (function(_super) {
  __extends(Evernote, _super);

  function Evernote() {}

  Evernote.prototype.fetch_recent_activity = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  Evernote.prototype.fetch_notebooks = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  Evernote.prototype.fetch_notes = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  Evernote.prototype.fetch_tags = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  return Evernote;

})(Service);

module.exports = new Evernote;
