logger = require '../lib/logger'

class Service
  constructor: ->
    @name = 'generic service'
    @config = {}

  log: ->
    logger.apply arguments

  initialize: (initialized = ->) ->
    initialized()

  fetch_recent_activity: (callback) ->
    if typeof callback is "function" then callback() else true

  process_webhook_activity: (params, callback) ->
    if typeof callback is "function" then callback() else true

module.exports = Service