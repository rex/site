Schema = require('../../../drivers/mongo').Schema

Plugins = require '../../plugins'

model_config =
  redis_prefix: 'service:github:repo'
  model_name: 'github_repo'

RepoSchema = new Schema
  personal:
    type: Boolean
    index: true
  repo_id:
    type: Number
    index: true
  owner:
    type: Schema.Types.ObjectId
    ref: 'github_user'
  owner_id:
    type: Number
    index: true
  owner_login:
    type: String
  name:
    type: String
  full_name:
    type: String
  private:
    type: Boolean
  fork:
    type: Boolean
  html_url:
    type: String
  description:
    type: String
  homepage:
    type: String
  size:
    type: Number
  stargazers_count:
    type: Number
  watchers_count:
    type: Number
  language:
    type: String
  has_issues:
    type: Boolean
  has_downloads:
    type: Boolean
  has_wiki:
    type: Boolean
  forks_count:
    type: Number
  open_issues_count:
    type: Number
  watchers:
    type: Number
  created_on:
    type: Date
  updated_on:
    type: Date

RepoSchema.plugin Plugins.config, model_config
RepoSchema.plugin Plugins.redis, model_config

RepoSchema.static 'createFromGithubRepo', (repo, callback = ->) ->
  new_repo = new this()

  new_repo.set repo

  new_repo.set
    repo_id: repo.id
    owner_id: repo.owner.id
    owner_login: repo.owner.login

  new_repo.save (err) ->
    callback err, new_repo

module.exports =
  schema: RepoSchema
  redis_prefix: model_config.redis_prefix
  model_name: model_config.model_name