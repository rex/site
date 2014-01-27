var Service, logger;

logger = require('../lib/logger');

Service = (function() {
  function Service() {
    this.name = 'generic service';
    this.config = {};
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

  Service.prototype.fetch_recent_activity = function(callback) {
    if (typeof callback === "function") {
      return callback();
    } else {
      return true;
    }
  };

  Service.prototype.process_webhook_activity = function(params, callback) {
    if (typeof callback === "function") {
      return callback();
    } else {
      return true;
    }
  };

  return Service;

})();

module.exports = Service;
