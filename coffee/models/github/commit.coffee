mongoose = require 'mongoose'
Schema = mongoose.Schema

CommitSchema = new Schema
  commit_id:
    type: String
    index: true
  distinct: Boolean
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

CommitSchema.methods.fromGithubCommit = (commit, callback) ->
  # First set all standard properties at once
  this.set commit

  # Then set all specific/custom properties
  this.set
    commit_id: commit.id

  this.save (err) ->
    callback err

module.exports = CommitSchema