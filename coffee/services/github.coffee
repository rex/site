Service = require './base'
config = require '../config'
async = require 'async'
_ = require '../lib/_'
mongo = require "../drivers/mongo"
logger = require '../lib/logger'

Models =
  Activity: mongo.model 'activity'
  Github_Push: mongo.model 'github_push'
  Github_Repo: mongo.model 'github_repo'
  Github_Commit: mongo.model 'github_commit'
  Github_User: mongo.model 'github_user'

class Github extends Service

  constructor: ->
    @api_config =
      headers:
        'User-Agent': 'prex.io'

    @api_base_url = "https://api.github.com"
    @login = config.github.username
    @api_is_json = true

    @tokens =
      access_token: process.env.GITHUB_ACCESS_TOKEN
      client_id: process.env.GITHUB_CLIENT_ID
      client_secret: process.env.GITHUB_CLIENT_SECRET

  fetch_recent_activity: (callback = ->) ->
    logger "Fetching recent github activity..."

    @api_call { url: "/users/#{@login}/events" }, (err, body) ->
      if err then return callback err

      return callback null, body

      activity_ids = _.pluck body, "id"

      logger "Found #{activity_ids.length} new activities", activity_ids
      Models.Activity.find
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

          Activity = new Models.Activity
            service: 'github'
            created_on: activity.created_at
            type: activity.type
            params: activity

          Activity.save next
        , (err) ->
          callback err, new_activities

  process_webhook_activity: (body, callback) ->
    async.each body.commits, (commit, next) ->
      new_commit = new Models.Github_Commit
      new_commit.fromGithubCommit commit, next
    , (err) ->
      callback err

  fetch_repo: (repo_full_name, callback = ->) ->
    @api_call { url: "/repos/#{repo_full_name}" }, callback

  fetch_repos_by_user: (user_login = @login, callback = ->) ->
    @api_call { url: "/users/#{user_login}/repos" }, callback

  fetch_gist: (gist_id, callback = ->) ->
    @api_call { url: "/gists/#{gist_id}" }, callback

  fetch_gists_by_user: (user_login = @login, callback = ->) ->
    @api_call { url: "/users/#{user_login}/gists" }, callback

  fetch_user: (user_login = @login, callback = ->) ->
    @api_call { url: "/users/#{user_login}" }, callback

  fetch_commit: (repo_full_name, commit_sha, callback = ->) ->
    unless repo_full_name then return callback "Repo full name required"
    @api_call { url: "/repos/#{repo_full_name}/commits/#{commit_sha}" }, callback

  fetch_commits_by_repo: (repo_full_name, callback = ->) ->
    unless repo_full_name then return callback "Repo full name required"
    @api_call { url: "/repos/#{repo_full_name}/commits" }, callback

module.exports = new Github