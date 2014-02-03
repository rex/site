logger = require '../lib/logger'
request = require 'request'
_ = require '../lib/_'

class Service
  constructor: (@config = {}, @api_config = {}) ->
    @name = 'generic service'
    @tokens = {}
    @api_is_json = true
    @api_base_url = ""

  log: ->
    logger.apply arguments

  initialize: (initialized = ->) ->
    initialized()

  prepare_api_call: (params = {}) ->
    unless @api_config then @api_config = {}
    params.url = "#{@api_base_url}#{params.url}"
    config = _.merge @api_config, params
    return config

  api_call: (params, callback) ->
    self = this
    config = @prepare_api_call params

    console.log "Config", config

    request config, (err, resp, body) ->
      if err then callback err, null
      else callback err, if self.api_is_json is true then JSON.parse body else body

  fetch_recent_activity: (callback = ->) ->

  process_webhook_activity: (params, callback = ->) ->

module.exports = Service