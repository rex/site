var BaseDriver, RedisDriver, config, logger, redis, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

redis = require('redis');

logger = require('../lib/logger');

_ = require('../lib/_');

BaseDriver = require('./base');

RedisDriver = (function(_super) {
  __extends(RedisDriver, _super);

  function RedisDriver(callback) {
    if (callback == null) {
      callback = function() {};
    }
    this.state = "";
    this.connected = false;
    this.debug = config.debug;
    callback();
  }

  RedisDriver.prototype.initialize = _.once(function(redis_initialized) {
    var self;
    if (redis_initialized == null) {
      redis_initialized = function() {};
    }
    self = this;
    this.instance = redis.createClient(config.redis.port, config.redis.host, config.redis.params);
    this.instance.debug_mode = true;
    this.instance.on('error', function() {
      self.debug && logger.error('Redis connection failure');
      self.state = 'error';
      return self.connected = false;
    });
    this.instance.on('end', function() {
      self.debug && logger.warn('Redis connection closed');
      self.state = 'connection_closed';
      return self.connected = false;
    });
    this.instance.on('drain', function() {
      return self.debug && logger('Redis command queue drained');
    });
    this.instance.on('idle', function() {
      self.debug && logger('Redis connection idle');
      return self.state = 'idle';
    });
    this.instance.on('connect', function() {
      self.state = 'connected';
      return self.connected = true;
    });
    this.instance.on('ready', function() {
      self.state = 'ready';
      self.connected = 'true';
      return redis_initialized();
    });
    return this;
  });

  RedisDriver.prototype.list_keys = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    logger("Listing all keys");
    return this.instance.keys('*', function(err, keys) {
      if (err) {
        console.error("Error fetching keys", err);
      } else {
        console.log("Keys found", keys);
      }
      return callback(err, keys);
    });
  };

  RedisDriver.prototype.set = function(redis_key, value, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.instance.set(redis_key, value, callback);
  };

  RedisDriver.prototype.get = function(redis_key, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.instance.get(redis_key, callback);
  };

  RedisDriver.prototype.store_model = function(redis_key, item, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.set(redis_key, JSON.stringify(item), callback);
  };

  RedisDriver.prototype.get_model = function(redis_key, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.get(redis_key, function(err, data) {
      if (data) {
        data = JSON.parse(data);
      }
      return callback(err, data);
    });
  };

  return RedisDriver;

})(BaseDriver);

module.exports = new RedisDriver;
