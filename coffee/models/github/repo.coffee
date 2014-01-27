Schema = require('../../drivers/mongo').Schema

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

RepoSchema.methods.fromGithubRepo = (repo) ->
  # Set all standard properties at once
  this.set repo

  # Then all specific/custom properties
  this.set
    repo_id: repo.id
    owner_id: repo.owner.id
    owner_username: repo.owner.login

module.exports = RepoSchema