var Github, Github_API, Models, Service, async, config, logger, mongo, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Service = require('./base');

config = require('../config');

async = require('async');

_ = require('../lib/_');

mongo = require("../drivers/mongo");

logger = require('../lib/logger');

Github_API = require('../apis/github');

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
    Github.__super__.constructor.call(this, {
      access_token: process.env.GITHUB_ACCESS_TOKEN
    });
  }

  Github.prototype.fetch_recent_activity = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    logger("Fetching recent github activity...");
    return Github_API.recent_events(function(err, body) {
      var activity_ids;
      if (err) {
        return done(err);
      }
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

  Github.prototype.fetch_repos = function(callback) {
    logger("Updating local cache of GitHub repositories...");
    return Github_API.fetch_repos(function(err, body) {
      return async.each(body, function(repo, complete) {
        return Models.Github_Repo.find({
          repo_id: repo.id
        }, function(err, local_repo) {
          if (err) {
            return complete(err);
          }
          local_repo = new Models.Github_Repo(local_repo);
          if (local_repo && local_repo.length) {
            local_repo.fromGithubRepo(repo);
            return local_repo.save(complete);
          } else {
            local_repo.fromGithubRepo(repo);
            return local_repo.save(complete);
          }
        });
      }, function(err) {
        return callback(err, body);
      });
    });
  };

  Github.prototype.fetch_user = function(login, callback) {
    if (callback == null) {
      callback = function() {};
    }
    logger("Fetching user " + login);
    return Github_API.fetch_user(login, callback);
  };

  Github.prototype.fetch_repo = function(repo_full_name, callback) {
    if (callback == null) {
      callback = function() {};
    }
    logger("Fetching repo " + repo_full_name);
    return Github_API.fetch_repo(repo_full_name, callback);
  };

  Github.prototype.fetch_commit = function(repo_full_name, commit_sha, callback) {
    if (callback == null) {
      callback = function() {};
    }
    logger("Fetching commit " + repo_full_name + "#" + commit_sha);
    return Github_API.fetch_commit(repo_full_name, commit_sha, callback);
  };

  Github.prototype.fetch_commits = function(repo_full_name, callback) {
    if (callback == null) {
      callback = function() {};
    }
    logger("Fetching commits for " + repo_full_name);
    return Github_API.fetch_commits(repo_full_name, callback);
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

  return Github;

})(Service);

module.exports = new Github;
