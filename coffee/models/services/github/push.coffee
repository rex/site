Schema = require('../../../drivers/mongo').Schema

Plugins = require '../../plugins'

model_config =
  redis_prefix: 'service:github:push'
  model_name: 'github_push'

PushSchema = new Schema
  push_id:
    type: Number
  repo:
    type: Schema.Types.ObjectId
    ref: 'github_repo'
  repo_id:
    type: Number
  repo_name:
    type: String
  public:
    type: Boolean
  commits: [
    type: Schema.Types.ObjectId
    ref: 'github_commit'
  ]
  created_on:
    type: Date
    default: Date.now

PushSchema.plugin Plugins.config, model_config
PushSchema.plugin Plugins.redis, model_config

PushSchema.static 'createFromGithubPush', (push, callback = ->) ->
  new_push = new this()

  new_push.set
    push_id: push.payload.push_id
    created_on: push.created_at
    repo_id: push.repo.id
    repo_name: push.repo.name

  new_push.save (err) ->
    callback err, new_push

module.exports =
  schema: PushSchema
  redis_prefix: model_config.redis_prefix
  model_name: model_config.model_name