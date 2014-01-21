config = require '../config'
redis = require 'redis'
logger = require './logger'

client = redis.createClient config.redis.port, config.redis.host, config.redis.params

client.on 'connect', ->
  logger 'Redis is connected'

client.on 'ready', ->
  logger 'Redis ready for commands'

client.on 'error', ->
  logger.error 'Redis connection failure'

client.on 'end', ->
  logger.warn 'Redis connection closed'

client.on 'drain', ->
  logger 'Redis command queue drained'

client.on 'idle', ->
  logger 'Redis connection idle'

module.exports = client