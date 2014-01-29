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

    @instance.debug_mode = true

    @instance.on 'error', ->
      logger.error 'Redis connection failure'
      self.state = 'error'
      self.connected = false

    @instance.on 'end', ->
      self.debug and logger.warn 'Redis connection closed'
      self.state = 'connection_closed'
      self.connected = false

    @instance.on 'drain', ->
      # self.debug and logger 'Redis command queue drained'

    @instance.on 'idle', ->
      # self.debug and logger 'Redis connection idle'
      self.state = 'idle'

    @instance.on 'connect', ->
      self.state = 'connected'
      self.connected = true

    @instance.on 'ready', ->
      self.state = 'ready'
      self.connected = 'true'
      redis_initialized()

    this

  list_keys: (callback = ->) ->
    logger "Listing all keys"
    @instance.keys '*', (err, keys) ->
      if err
        console.error "Error fetching keys", err
      else
        console.log "Keys found", keys
      callback err, keys

  set: (redis_key, value, callback = ->) ->
    @instance.set redis_key, value, callback

  get: (redis_key, callback = ->) ->
    @instance.get redis_key, callback

  store_model: (redis_key, item, callback = ->) ->
    @set redis_key, JSON.stringify(item), callback

  get_model: (redis_key, callback = ->) ->
    @get redis_key, (err, data) ->
      callback err, JSON.parse data


module.exports = new RedisDriver