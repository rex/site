# mongoose = require 'mongoose'
mongo = require '../drivers/mongo'
config = require '../config'
logger = require '../lib/logger'
_ = require '../lib/_'

schemas =
  activity: require './activity'
  env: require './env'
  github:
    repo: require './github/repo'
    commit: require './github/commit'
  job: require './job'
  link: require './link'
  oauth_token: require './oauth_token'
  post: require './post'
  queue_item: require './queue_item'
  snippet: require './snippet'
  tag: require './tag'
  visit: require './visit'

exports.initialize = (after_connected = ->) ->
  # Instantiate our models
  mongo.model 'activity', schemas.activity, 'activities'
  mongo.model 'env', schemas.env, 'env_vars'
  mongo.model 'github_commit', schemas.github.commit
  mongo.model 'github_repo', schemas.github.repo
  mongo.model 'job', schemas.job
  mongo.model 'link', schemas.link
  mongo.model 'oauth_token', schemas.oauth_token
  mongo.model 'post', schemas.post
  mongo.model 'queue_item', schemas.queue_item
  mongo.model 'snippet', schemas.snippet
  mongo.model 'tag', schemas.tag
  mongo.model 'visit', schemas.visit

  # Connect to Mongo
  mongo.initialize after_connected