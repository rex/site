var API, Github, config,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

API = require('./base');

Github = (function(_super) {
  __extends(Github, _super);

  function Github() {
    this.config = {
      headers: {
        'User-Agent': 'prex.io'
      }
    };
    this.base_url = 'https://api.github.com';
    this.login = config.github.username;
    this.is_json = true;
    this.tokens = {
      access_token: process.env.GITHUB_ACCESS_TOKEN,
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET
    };
  }

  Github.prototype.recent_events = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.fire({
      url: "/users/" + this.login + "/events"
    }, callback);
  };

  Github.prototype.fetch_repo = function(repo_full_name, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.fire({
      url: "/repos/" + repo_full_name
    }, callback);
  };

  Github.prototype.fetch_repos = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.fire({
      url: "/users/" + this.login + "/repos"
    }, callback);
  };

  Github.prototype.fetch_gist = function(gist_id, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.fire({
      url: "/gists/" + gist_id
    }, callback);
  };

  Github.prototype.fetch_gists = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.fire({
      url: "/users/" + this.login + "/gists"
    }, callback);
  };

  Github.prototype.fetch_user = function(login, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.fire({
      url: "/users/" + login
    }, callback);
  };

  Github.prototype.fetch_commit = function(repo_full_name, commit_sha, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.fire({
      url: "/repos/" + repo_full_name + "/commits/" + commit_sha
    }, callback);
  };

  Github.prototype.fetch_commits = function(repo_full_name, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.fire({
      url: "/repos/" + repo_full_name + "/commits"
    }, callback);
  };

  return Github;

})(API);

module.exports = new Github;
