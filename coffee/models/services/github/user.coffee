Schema = require('../../../drivers/mongo').Schema
Redis = require '../../../drivers/redis'

Plugins = require '../../plugins'

model_config =
  redis_prefix: 'service:github:user'
  model_name: 'github_user'

UserSchema = new Schema
  user_id:
    type: Number
  login:
    type: String
  avatar:
    type: String
  name:
    type: String
  company:
    type: String
  blog:
    type: String
  location:
    type: String
  email:
    type: String
  hireable:
    type: Boolean
  bio:
    type: String
  public_repos:
    type: Number
  public_gists:
    type: Number
  followers_count:
    type: Number
  following_count:
    type: Number
  created_on:
    type: Date
  updated_on:
    type: Date

UserSchema.plugin Plugins.config, model_config
UserSchema.plugin Plugins.redis, model_config

UserSchema.static 'createFromGithubUser', (user, callback = ->) ->
  new_user = new this()

  new_user.set user

  new_user.set
    user_id: user.id
    followers_count: user.followers
    following_count: user.following
    created_on: user.created_at
    updated_on: user.updated_at

  new_user.save (err) ->
    callback err, new_user

module.exports =
  schema: UserSchema
  redis_prefix: model_config.redis_prefix
  model_name: model_config.model_name