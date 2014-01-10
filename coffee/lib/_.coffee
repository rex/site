logger = require './logger'
_ = require 'underscore'

_.mixin
  log: ->
    logger.apply logger, arguments

module.exports = _