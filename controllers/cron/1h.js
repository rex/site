var Models, async, github, logger, mongoose, _;

logger = require('../../lib/logger');

_ = require('../../lib/_');

github = require('../../lib/github');

async = require('async');

mongoose = require('mongoose');

Models = {
  github_repo: mongoose.model('github_repo')
};

module.exports = function() {
  logger("Cron running: 1h");
  return async.parallel({
    github_repos: function(done) {
      logger("Updating local cache of GitHub repositories...");
      return github.repos(function(err, body) {
        return _.each(body, function(repo) {
          logger("Processing " + repo.name);
          return Models.github_repo.find({
            repo_id: repo.id
          }, function(err, local_repo) {
            if (err) {
              return done(err);
            }
            if (local_repo) {
              logger("Updating existing local repo for " + repo.name + "...");
              local_repo.fromGithubRepo(repo);
              return local_repo.save(done);
            } else {
              logger("Creating new local repo for " + repo.name);
              local_repo = new Models.github_repo;
              local_repo.fromGithubRepo(repo);
              return local_repo.save(done);
            }
          });
        });
      });
    }
  }, function(err, results) {
    if (err) {
      return res.json(500, {
        err: err
      });
    } else {
      return res.json({
        results: results
      });
    }
  });
};
