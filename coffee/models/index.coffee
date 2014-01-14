mongoose = require 'mongoose'
config = require '../config'
logger = require '../lib/logger'
_ = require '../lib/_'

schemas =
  post: require './post'
  job: require './job'
  snippet: require './snippet'
  tag: require './tag'
  link: require './link'
  activity: require './activity'
  visit: require './visit'

exports.initialize = ->
  # Instantiate our models
  logger "Initializing models..."

  mongoose.model 'post', schemas.post
  mongoose.model 'job', schemas.job
  mongoose.model 'snippet', schemas.snippet
  mongoose.model 'tag', schemas.tag
  mongoose.model 'link', schemas.link
  mongoose.model 'activity', schemas.activity, 'activities'
  mongoose.model 'visit', schemas.visit

  # Get connection instance to operate on
  conn = mongoose.connection

  # Set up event listeners to properly handle events
  logger "Initializing Mongoose event listeners..."
  conn.on 'connecting', ->
    logger 'Mongoose connecting...'

  conn.on 'connected', ->
    logger 'Mongoose connected...'

  conn.once 'open', ->
    logger 'Mongoose connection open...'
    # Display loaded models
    logger "Loaded #{mongoose.modelNames().length} models:"
    _.each mongoose.modelNames(), (name) ->
      logger " > #{name}"

  conn.on 'disconnecting', ->
    logger.warn 'Mongoose disconnecting...'

  conn.on 'disconnected', ->
    logger.warn 'Mongoose disconnected...'

  conn.on 'close', ->
    logger.warn 'Closing Mongoose connection...'

  conn.on 'reconnected', ->
    logger 'Mongoose reconnected...'

  conn.on 'error', ->
    logger.error 'Mongoose connection error!'

  conn.on 'fullsetup', ->
    logger 'All replica set nodes set up...'

  # Instantiate the connection
  logger "Connecting to MongoDB..."

  mongoose.connect config.mongo.url, {}, ->
    logger "Mongoose connected?", arguments