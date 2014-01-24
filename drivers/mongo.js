var BaseDriver, MongoDriver, config, logger, mongoose, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

logger = require('../lib/logger');

_ = require('../lib/_');

mongoose = require('mongoose');

BaseDriver = require('./base');

MongoDriver = (function(_super) {
  __extends(MongoDriver, _super);

  function MongoDriver(callback) {
    if (callback == null) {
      callback = function() {};
    }
    this.debug = true;
    this.instance = mongoose;
    this.Schema = mongoose.Schema;
    this.ObjectId = mongoose.Types.ObjectId;
    this.loaded_models = [];
    this.state = "";
    this.connected = false;
    callback();
  }

  MongoDriver.prototype.model = function(name, schema, collection_name) {
    if (name && schema) {
      this.loaded_models.push(name);
      return this.instance.model(name, schema, collection_name);
    } else {
      return this.instance.model(name);
    }
  };

  MongoDriver.prototype.initialize = _.once(function(mongo_connected) {
    var conn, self;
    if (mongo_connected == null) {
      mongo_connected = function() {};
    }
    conn = this.instance.connection;
    self = this;
    conn.on('disconnecting', function() {
      self.debug && logger.warn('Mongoose disconnecting...');
      self.state = 'disconnecting';
      return self.connected = false;
    });
    conn.on('disconnected', function() {
      self.debug && logger.warn('Mongoose disconnected...');
      self.state = 'disconnected';
      return self.connected = false;
    });
    conn.on('close', function() {
      self.debug && logger.warn('Closing Mongoose connection...');
      self.state = 'closing';
      return self.connected = false;
    });
    conn.on('reconnected', function() {
      self.debug && logger('Mongoose reconnected...');
      self.state = 'reconnected';
      return self.connected = true;
    });
    conn.on('error', function() {
      self.debug && logger.error('Mongoose connection error!');
      self.state = 'connection_error';
      return self.connected = false;
    });
    conn.on('fullsetup', function() {});
    conn.on('connected', function() {
      self.state = 'connected';
      return self.connected = true;
    });
    conn.once('open', function() {
      self.state = 'connection_open';
      self.connected = true;
      return mongo_connected();
    });
    return this.instance.connect(config.mongo.url, {});
  });

  MongoDriver.prototype.show_loaded_models = function() {
    if (this.debug) {
      logger("Loaded " + (this.instance.modelNames().length) + " models:");
      return _.each(this.instance.modelNames(), function(name) {
        return logger(" > " + name);
      });
    }
  };

  return MongoDriver;

})(BaseDriver);

module.exports = new MongoDriver;
