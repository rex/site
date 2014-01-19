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
        return async.each(body, function(repo, complete) {
          return Models.github_repo.find({
            repo_id: repo.id
          }, function(err, local_repo) {
            if (err) {
              return complete(err);
            }
            if (local_repo && local_repo.length) {
              logger("Updating existing local repo for " + repo.name + "...");
              local_repo = new Models.github_repo(local_repo);
              local_repo.fromGithubRepo(repo);
              return local_repo.save(complete);
            } else {
              logger("Creating new local repo for " + repo.name);
              local_repo = new Models.github_repo;
              local_repo.fromGithubRepo(repo);
              return local_repo.save(complete);
            }
          });
        }, function(err) {
          return done(err);
        });
      });
    }
  }, function(err, results) {
    if (err) {
      return logger.error(err);
    } else {
      return logger("Successfully completed 1h cron");
    }
  });
};
