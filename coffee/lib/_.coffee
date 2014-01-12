logger = require './logger'
_ = require 'underscore'
moment = require 'moment'

_.mixin
  log: ->
    logger.apply logger, arguments

  date: (dateString, format) ->
    unless dateString then dateString = new Date()
    unless format then format = "MM/DD/YYYY hh:mm:ss a"
    moment(dateString).format format

  calendar: (dateString) ->
    moment(dateString).calendar()

  age: (dateString) ->
    moment(dateString).fromNow()

  dayOfMonth: (dateString) ->
    _.date dateString, "D"

  date2d: (dateString) ->
    _.date dateString, "DD"

  month2d: (dateString) ->
    _.date dateString, "MM"

  monthAbbr: (dateString) ->
    _.date dateString, "MMM"

  monthFull: (dateString) ->
    _.date dateString, "MMMM"

  year: (dateString) ->
    _.date dateString, "YYYY"

  sha_stub: (sha_hash) ->
    sha_hash.substring(0, 6)

module.exports = _