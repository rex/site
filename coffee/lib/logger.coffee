winston = require 'winston'

# Enable shorter CLI logging
winston.cli()

# Expose logging methods
module.exports = ->
  winston.info.apply winston.info, arguments

module.exports.info = ->
  winston.info.apply winston.info, arguments

module.exports.debug = ->
  winston.info.apply winston.info, arguments

module.exports.warn = ->
  winston.warn.apply winston.warn, arguments

module.exports.error = ->
  winston.error.apply winston.error, arguments