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
  owner_id: Number
  owner_username: String
  name: String
  full_name: String
  private: Boolean
  html_url: String
  description: String
  fork: Boolean
  created_on:
    type: Date
    index: true
  updated_on:
    type: Date
    index: true
  homepage: String
  size: Number
  stargazers_count: Number
  watchers_count: Number
  language: String
  has_issues: Boolean
  has_downloads: Boolean
  has_wiki: Boolean
  forks_count: Number
  open_issues_count: Number
  watchers: Number
  default_branch: String
  master_branch: String

RepoSchema.plugin Plugins.config, model_config
RepoSchema.plugin Plugins.redis, model_config

RepoSchema.static 'fromGithubRepo', (repo) ->
  # Set all standard properties at once
  this.set repo

  # Then all specific/custom properties
  this.set
    repo_id: repo.id
    owner_id: repo.owner.id
    owner_username: repo.owner.login

module.exports =
  schema: RepoSchema
  redis_prefix: model_config.redis_prefix
  model_name: model_config.model_name