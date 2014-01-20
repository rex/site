logger = require '../../lib/logger'
_ = require '../../lib/_'
github = require '../../lib/github'
async = require 'async'
mongoose = require 'mongoose'
util = require 'util'

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
        async.each body, (repo, complete) ->
          Models.github_repo.find
            repo_id: repo.id
          , (err, local_repo) ->
            if err then return complete err
            local_repo = new Models.github_repo local_repo
            if local_repo and local_repo.length
              local_repo.fromGithubRepo repo
              local_repo.save complete
            else
              local_repo.fromGithubRepo repo
              local_repo.save complete
        , (err) ->
          done(err)

  , (err, results) ->
    if err
      logger.error err
    else
      logger "Successfully completed 1h cron"