Schema = require('../../../drivers/mongo').Schema

Plugins = require '../../plugins'

model_config =
  redis_prefix: 'service:github:commit'
  model_name: 'github_commit'

CommitSchema = new Schema
  commit_id:
    type: String
    index: true
  repo:
    type: Schema.Types.ObjectId
    ref: 'github_repo'
    index: true
  push:
    type: Schema.Types.ObjectId
    ref: 'github_push'
    index: true
  message: String
  created_on:
    type: Date
    index: true
  url: String
  author: {}
  committer: {}
  added: [{
    type: String
  }]
  removed: [{
    type: String
  }]
  modified: [{
    type: String
  }]

CommitSchema.plugin Plugins.config, model_config
CommitSchema.plugin Plugins.redis, model_config

CommitSchema.static 'createFromGithubCommit', (commit, callback = ->) ->
  new_commit = new this()
  # First set all standard properties at once
  new_commit.set commit

  # Then set all specific/custom properties
  new_commit.set
    commit_id: commit.id

  new_commit.save (err) ->
    callback err, new_commit

module.exports =
  schema: CommitSchema
  redis_prefix: model_config.redis_prefix
  model_name: model_config.model_name