request = require 'request'
_ = require '../lib/_'
logger = require '../lib/logger'

class API
  constructor: (@config = {}) ->

  tokens: {}

  is_json: true

  base_url: ""

  prepare: (params = {}) ->
    params.url = "#{@base_url}#{params.url}"
    config = _.merge @config, params
    return config

  fire: (params, callback) ->
    self = this
    config = @prepare params

    request config, (err, resp, body) ->
      if err then callback err, null
      else callback err, if self.is_json is true then JSON.parse body else body

module.exports = API