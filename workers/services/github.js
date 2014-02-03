var BaseWorker, Github, Models, Mongo, Queue, async, logger,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseWorker = require('../base');

Queue = require('../../drivers/queue');

Mongo = require('../../drivers/mongo');

logger = require('../../lib/logger');

async = require('async');

Models = {
  Activity: Mongo.model('activity'),
  Github_Repo: Mongo.model('github_repo'),
  Github_Commit: Mongo.model('github_commit')
};

Github = (function(_super) {
  __extends(Github, _super);

  function Github() {
    return Github.__super__.constructor.apply(this, arguments);
  }

  Github.prototype.initialize = function(initialized) {
    if (initialized == null) {
      initialized = function() {};
    }
    this.queue_name = "service:github";
    Queue.add_queue(this.queue_name);
    Queue.add_handlers(this.queue_name, {
      repo_created: this.handle_new_repo,
      commit_created: this.handle_new_commit,
      tag_created: this.handle_new_tag,
      commits_pushed: this.handle_push,
      repo_starred: this.handle_star
    });
    return initialized();
  };

  Github.prototype.handle_new_repo = function(repo, callback) {
    if (callback == null) {
      callback = function() {};
    }
    logger("Handling new repo");
    return callback();
  };

  Github.prototype.handle_new_commit = function(commit, callback) {
    if (callback == null) {
      callback = function() {};
    }
    logger("Handling new commit");
    return callback();
  };

  Github.prototype.handle_new_tag = function(tag, callback) {
    if (callback == null) {
      callback = function() {};
    }
    logger("Handling new tag");
    return callback();
  };

  Github.prototype.handle_push = function(push, callback) {
    if (callback == null) {
      callback = function() {};
    }
    logger("Handling push");
    return callback();
  };

  Github.prototype.handle_star = function(repo, callback) {
    if (callback == null) {
      callback = function() {};
    }
    logger("Handling star");
    return callback();
  };

  return Github;

})(BaseWorker);

module.exports = new Github;
