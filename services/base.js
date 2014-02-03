var Service, logger, request, _;

logger = require('../lib/logger');

request = require('request');

_ = require('../lib/_');

Service = (function() {
  function Service(config, api_config) {
    this.config = config != null ? config : {};
    this.api_config = api_config != null ? api_config : {};
    this.name = 'generic service';
    this.tokens = {};
    this.api_is_json = true;
    this.api_base_url = "";
  }

  Service.prototype.log = function() {
    return logger.apply(arguments);
  };

  Service.prototype.initialize = function(initialized) {
    if (initialized == null) {
      initialized = function() {};
    }
    return initialized();
  };

  Service.prototype.prepare_api_call = function(params) {
    var config;
    if (params == null) {
      params = {};
    }
    if (!this.api_config) {
      this.api_config = {};
    }
    params.url = "" + this.api_base_url + params.url;
    config = _.merge(this.api_config, params);
    return config;
  };

  Service.prototype.api_call = function(params, callback) {
    var config, self;
    self = this;
    config = this.prepare_api_call(params);
    console.log("Config", config);
    return request(config, function(err, resp, body) {
      if (err) {
        return callback(err, null);
      } else {
        return callback(err, self.api_is_json === true ? JSON.parse(body) : body);
      }
    });
  };

  Service.prototype.fetch_recent_activity = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  Service.prototype.process_webhook_activity = function(params, callback) {
    if (callback == null) {
      callback = function() {};
    }
  };

  return Service;

})();

module.exports = Service;
