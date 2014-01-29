BaseWorker = require '../base'
Queue = require '../../drivers/queue'
Mongo = require '../../drivers/mongo'
logger = require '../../lib/logger'
async = require 'async'

Models =
  Activity: Mongo.model 'activity'
  Github_Repo: Mongo.model 'github_repo'
  Github_Commit: Mongo.model 'github_commit'

class Github extends BaseWorker

  initialize: (initialized = ->) ->
    @queue_name = "service:github"

    # Create the queue
    Queue.add_queue @queue_name

    # Add our handlers
    Queue.add_handlers @queue_name,
      repo_created: @handle_new_repo
      commit_created: @handle_new_commit
      tag_created: @handle_new_tag
      commits_pushed: @handle_push
      repo_starred: @handle_star

    initialized()

  handle_new_repo: (repo, callback = ->) ->
    logger "Handling new repo"
    callback()

  handle_new_commit: (commit, callback = ->) ->
    logger "Handling new commit"
    callback()

  handle_new_tag: (tag, callback = ->) ->
    logger "Handling new tag"
    callback()

  handle_push: (push, callback = ->) ->
    logger "Handling push"
    callback()

  handle_star: (repo, callback = ->) ->
    logger "Handling star"
    callback()

module.exports = new Github