moment = require 'moment'

module.exports = (_) ->
  _.mixin

    ###
      DISPLAY/OUTPUT FORMAT METHODS
    ###
    date: (dateString, format) ->
      unless dateString then dateString = new Date()
      unless format then format = "MM/DD/YYYY hh:mm:ss a"
      moment(dateString).format format

    calendar: (dateString) ->
      moment(dateString).calendar()

    age: (dateString) ->
      moment(dateString).fromNow()

    utc_date: (dateString) ->
      moment.utc dateString

    pretty_date: (dateString) ->
      _.date dateString, "dddd, MMMM Do YYYY, h:mm:ss a ZZ"

    pretty_utc_date: (dateString) ->
      _.pretty_date _.utc_date(dateString)

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

    ###
      PARSING METHODS
    ###
    parse_date: (dateString, format) ->
      moment dateString, format

    parse_unix_timestamp: (unix_timestamp) ->
      timestamp = moment parseInt unix_timestamp

      # If it happened before my birthday, the stamp is likely wrong.
      if timestamp.isBefore '1986-12-02'
        timestamp = moment parseInt unix_timestamp * 1000
      else
        timestamp
  _