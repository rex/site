config = require '../config'
logger = require '../lib/logger'
_ = require '../lib/_'
mongoose = require 'mongoose'
BaseDriver = require './base'

class MongoDriver extends BaseDriver

  constructor: (callback = ->) ->
    @debug = config.debug
    @instance = mongoose
    @Schema = mongoose.Schema
    @ObjectId = mongoose.Types.ObjectId
    @loaded_models = []
    @state = ""
    @connected = false
    callback()

  model: (name, schema, collection_name) ->
    if name and schema
      @loaded_models.push name
      @instance.model name, schema, collection_name
    else
      @instance.model name

  initialize: _.once (mongo_connected = ->) ->
    conn = @instance.connection
    self = this

    conn.on 'disconnecting', ->
      self.debug and logger.warn 'Mongoose disconnecting...'
      self.state = 'disconnecting'
      self.connected = false

    conn.on 'disconnected', ->
      self.debug and logger.warn 'Mongoose disconnected...'
      self.state = 'disconnected'
      self.connected = false

    conn.on 'close', ->
      self.debug and logger.warn 'Closing Mongoose connection...'
      self.state = 'closing'
      self.connected = false

    conn.on 'reconnected', ->
      self.debug and logger 'Mongoose reconnected...'
      self.state = 'reconnected'
      self.connected = true

    conn.on 'error', ->
      self.debug and logger.error 'Mongoose connection error!'
      self.state = 'connection_error'
      self.connected = false

    conn.on 'fullsetup', ->

    conn.on 'connected', ->
      self.state = 'connected'
      self.connected = true

    conn.once 'open', ->
      self.state = 'connection_open'
      self.connected = true
      mongo_connected()

    @instance.connect config.get_mongo_url(), {}

  show_loaded_models: ->
    if @debug
      logger "Loaded #{@instance.modelNames().length} models:"
      _.each @instance.modelNames(), (name) ->
        logger " > #{name}"


module.exports = new MongoDriver