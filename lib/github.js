var fire, keys, logger, request, _;

request = require('request');

_ = require('./_');

logger = require('./logger');

keys = {
  id: process.env.GITHUB_CLIENT_ID,
  secret: process.env.GITHUB_CLIENT_SECRET
};

fire = function(params, callback) {
  var config;
  config = _.extend({
    headers: {
      'User-Agent': 'prex-site'
    }
  }, params);
  config.url = "https://api.github.com" + config.url;
  return request(config, function(err, resp, body) {
    if (err) {
      return callback(err, null);
    } else {
      return callback(err, JSON.parse(body));
    }
  });
};

module.exports = {
  events: function(callback) {
    return fire({
      url: '/users/rex/events'
    }, callback);
  },
  repos: function(callback) {
    return fire({
      url: '/users/rex/repos'
    }, callback);
  }
};
