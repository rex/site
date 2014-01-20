var Github, Github_API, Models, Service, async, config, logger, mongoose, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Service = require('./base');

config = require('../config');

async = require('async');

_ = require('../lib/_');

mongoose = require('mongoose');

logger = require('../lib/logger');

Github_API = require('../apis/github');

Models = {
  activity: mongoose.model('activity'),
  github_repo: mongoose.model('github_repo'),
  github_commit: mongoose.model('github_commit')
};

Github = (function(_super) {
  __extends(Github, _super);

  function Github() {
    Github.__super__.constructor.call(this, {
      access_token: process.env.GITHUB_ACCESS_TOKEN
    });
  }

  Github.prototype.fetch_recent_activity = function(callback) {
    logger("Fetching recent github activity...");
    return Github_API.recent_events(function(err, body) {
      var activity_ids;
      if (err) {
        return done(err);
      }
      activity_ids = _.pluck(body, "id");
      logger("Found " + activity_ids.length + " new activities", activity_ids);
      return Models.activity.find({
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
          Activity = new Models.activity({
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
    return Github_API.repos(function(err, body) {
      return async.each(body, function(repo, complete) {
        return Models.github_repo.find({
          repo_id: repo.id
        }, function(err, local_repo) {
          if (err) {
            return complete(err);
          }
          local_repo = new Models.github_repo(local_repo);
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

  Github.prototype.process_webhook_activity = function(body, callback) {
    return async.each(body.commits, function(commit, next) {
      var new_commit;
      new_commit = new Models.github_commit;
      return new_commit.fromGithubCommit(commit, function(err) {
        return next(err);
      });
    }, function(err) {
      return callback(err);
    });
  };

  return Github;

})(Service);

module.exports = new Github;
