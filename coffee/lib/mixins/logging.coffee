logger = require '../logger'

module.exports = (_) ->
  _.mixin
    log: ->
      logger.apply logger, arguments

  _