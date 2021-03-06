var Github, Models, Service, async, config, logger, mongo, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Service = require('./base');

config = require('../config');

async = require('async');

_ = require('../lib/_');

mongo = require("../drivers/mongo");

logger = require('../lib/logger');

Models = {
  Activity: mongo.model('activity'),
  Github_Push: mongo.model('github_push'),
  Github_Repo: mongo.model('github_repo'),
  Github_Commit: mongo.model('github_commit'),
  Github_User: mongo.model('github_user')
};

Github = (function(_super) {
  __extends(Github, _super);

  function Github() {
    this.api_config = {
      headers: {
        'User-Agent': 'prex.io'
      }
    };
    this.api_base_url = "https://api.github.com";
    this.login = config.github.username;
    this.api_is_json = true;
    this.tokens = {
      access_token: process.env.GITHUB_ACCESS_TOKEN,
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET
    };
  }

  Github.prototype.fetch_recent_activity = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    logger("Fetching recent github activity...");
    return this.api_call({
      url: "/users/" + this.login + "/events"
    }, function(err, body) {
      var activity_ids;
      if (err) {
        return callback(err);
      }
      return callback(null, body);
      activity_ids = _.pluck(body, "id");
      logger("Found " + activity_ids.length + " new activities", activity_ids);
      return Models.Activity.find({
        service: "github",
        'params.id': {
          '$in': activity_ids
        }
      }, function(err, existing_activities) {
        var new_activities, old_activities;
        logger("Found " + existing_activities.length + " existing activities");
        old_activities = _.map(existing_activities, function(existing_activity) {
          return existing_activity.params.id;
        });
        new_activities = _.difference(activity_ids, old_activities);
        return async.each(new_activities, function(activity_id, next) {
          var Activity, activity;
          activity = _.findWhere(body, {
            id: activity_id
          });
          Activity = new Models.Activity({
            service: 'github',
            created_on: activity.created_at,
            type: activity.type,
            params: activity
          });
          return Activity.save(next);
        }, function(err) {
          return callback(err, new_activities);
        });
      });
    });
  };

  Github.prototype.process_webhook_activity = function(body, callback) {
    return async.each(body.commits, function(commit, next) {
      var new_commit;
      new_commit = new Models.Github_Commit;
      return new_commit.fromGithubCommit(commit, next);
    }, function(err) {
      return callback(err);
    });
  };

  Github.prototype.fetch_repo = function(repo_full_name, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.api_call({
      url: "/repos/" + repo_full_name
    }, callback);
  };

  Github.prototype.fetch_repos_by_user = function(user_login, callback) {
    if (user_login == null) {
      user_login = this.login;
    }
    if (callback == null) {
      callback = function() {};
    }
    return this.api_call({
      url: "/users/" + user_login + "/repos"
    }, callback);
  };

  Github.prototype.fetch_gist = function(gist_id, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.api_call({
      url: "/gists/" + gist_id
    }, callback);
  };

  Github.prototype.fetch_gists_by_user = function(user_login, callback) {
    if (user_login == null) {
      user_login = this.login;
    }
    if (callback == null) {
      callback = function() {};
    }
    return this.api_call({
      url: "/users/" + user_login + "/gists"
    }, callback);
  };

  Github.prototype.fetch_user = function(user_login, callback) {
    if (user_login == null) {
      user_login = this.login;
    }
    if (callback == null) {
      callback = function() {};
    }
    return this.api_call({
      url: "/users/" + user_login
    }, callback);
  };

  Github.prototype.fetch_commit = function(repo_full_name, commit_sha, callback) {
    if (callback == null) {
      callback = function() {};
    }
    if (!repo_full_name) {
      return callback("Repo full name required");
    }
    return this.api_call({
      url: "/repos/" + repo_full_name + "/commits/" + commit_sha
    }, callback);
  };

  Github.prototype.fetch_commits_by_repo = function(repo_full_name, callback) {
    if (callback == null) {
      callback = function() {};
    }
    if (!repo_full_name) {
      return callback("Repo full name required");
    }
    return this.api_call({
      url: "/repos/" + repo_full_name + "/commits"
    }, callback);
  };

  return Github;

})(Service);

module.exports = new Github;
