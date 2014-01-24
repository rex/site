config = require '../config'
redis = require 'redis'
logger = require '../lib/logger'
_ = require '../lib/_'
BaseDriver = require './base'

class RedisDriver extends BaseDriver

  constructor: (callback = ->) ->
    @state = ""
    @connected = false
    @debug = config.debug
    callback()

  initialize: _.once (redis_initialized = ->) ->
    self = this
    @instance = redis.createClient config.redis.port, config.redis.host, config.redis.params

    @instance.on 'error', ->
      self.debug and logger.error 'Redis connection failure'
      self.state = 'error'
      self.connected = false

    @instance.on 'end', ->
      self.debug and logger.warn 'Redis connection closed'
      self.state = 'connection_closed'
      self.connected = false

    @instance.on 'drain', ->
      self.debug and logger 'Redis command queue drained'

    @instance.on 'idle', ->
      self.debug and logger 'Redis connection idle'
      self.state = 'idle'

    @instance.on 'connect', ->
      self.state = 'connected'
      self.connected = true

    @instance.on 'ready', ->
      self.state = 'ready'
      self.connected = 'true'
      redis_initialized()

    this



module.exports = new RedisDriver