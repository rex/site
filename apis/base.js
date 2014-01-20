var API, logger, request, _;

request = require('request');

_ = require('../lib/_');

logger = require('../lib/logger');

API = (function() {
  function API(config) {
    this.config = config != null ? config : {};
  }

  API.prototype.tokens = {};

  API.prototype.is_json = true;

  API.prototype.base_url = "";

  API.prototype.prepare = function(params) {
    var config;
    if (params == null) {
      params = {};
    }
    params.url = "" + this.base_url + params.url;
    config = _.merge(this.config, params);
    return config;
  };

  API.prototype.fire = function(params, callback) {
    var config, self;
    self = this;
    config = this.prepare(params);
    return request(config, function(err, resp, body) {
      if (err) {
        return callback(err, null);
      } else {
        return callback(err, self.is_json === true ? JSON.parse(body) : body);
      }
    });
  };

  return API;

})();

module.exports = API;
