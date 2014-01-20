var API, Github,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

API = require('./base');

Github = (function(_super) {
  __extends(Github, _super);

  function Github() {
    this.config = {
      headers: {
        'User-Agent': 'prex-site'
      }
    };
    this.base_url = 'https://api.github.com';
    this.is_json = true;
    this.tokens = {
      access_token: process.env.GITHUB_ACCESS_TOKEN,
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET
    };
  }

  Github.prototype.recent_events = function(callback) {
    return this.fire({
      url: '/users/rex/events'
    }, callback);
  };

  Github.prototype.repos = function(callback) {
    return this.fire({
      url: '/users/rex/repos'
    }, callback);
  };

  return Github;

})(API);

module.exports = new Github;
