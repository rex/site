logger = require '../../lib/logger'
_ = require '../../lib/_'
github = require '../../lib/github'
async = require 'async'
mongoose = require 'mongoose'

Models =
  github_repo: mongoose.model 'github_repo'

module.exports = ->
  logger "Cron running: 1h"

  # Start our asynchronous/parallel cron functions
  async.parallel

    # Retrieve full list of github repos
    github_repos: (done) ->
      logger "Updating local cache of GitHub repositories..."
      github.repos (err, body) ->
        _.each body, (repo) ->
          logger "Processing #{repo.name}"
          Models.github_repo.find
            repo_id: repo.id
          , (err, local_repo) ->
            if err then return done err
            if local_repo
              logger "Updating existing local repo for #{repo.name}..."
              local_repo.fromGithubRepo repo
              local_repo.save done
            else
              logger "Creating new local repo for #{repo.name}"
              local_repo = new Models.github_repo
              local_repo.fromGithubRepo repo
              local_repo.save done

  , (err, results) ->
    if err
      res.json 500,
        err: err
    else
      res.json
        results: results