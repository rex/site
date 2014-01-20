Service = require './base'
config = require '../config'
async = require 'async'
_ = require '../lib/_'
mongoose = require 'mongoose'
logger = require '../lib/logger'

Github_API = require '../apis/github'

Models =
  activity: mongoose.model 'activity'
  github_repo: mongoose.model 'github_repo'
  github_commit: mongoose.model 'github_commit'

class Github extends Service

  constructor: ->
    super
      access_token: process.env.GITHUB_ACCESS_TOKEN

  fetch_recent_activity: (callback) ->
    logger "Fetching recent github activity..."

    Github_API.recent_events (err, body) ->
      if err then return done err

      activity_ids = _.pluck body, "id"

      logger "Found #{activity_ids.length} new activities", activity_ids
      Models.activity.find
        service: "github"
        'params.id':
          '$in': activity_ids
      , (err, existing_activities) ->
        logger "Found #{existing_activities.length} existing activities"
        old_activities = _.map existing_activities, (existing_activity) ->
          existing_activity.params.id
        new_activities = _.difference activity_ids, old_activities

        async.each new_activities, (activity_id, next) ->
          activity = _.findWhere body,
            id: activity_id

          Activity = new Models.activity
            service: 'github'
            created_on: activity.created_at
            type: activity.type
            params: activity

          Activity.save next
        , (err) ->
          callback err, new_activities

  fetch_repos: (callback) ->
    logger "Updating local cache of GitHub repositories..."

    Github_API.repos (err, body) ->
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
        callback err, body

  process_webhook_activity: (body, callback) ->
    async.each body.commits, (commit, next) ->
      new_commit = new Models.github_commit
      new_commit.fromGithubCommit commit, (err) ->
        next err
    , (err) ->
      callback err


module.exports = new Github