queue = require '../drivers/queue'
mongo = require '../drivers/mongo'

Workers =
  Services:
    LastFM: require './services/lastfm'

exports.initialize = (workers_initialized = ->) ->

  ###
  Initialize Service Workers
  ###

  # LastFM
  require('./services/lastfm').initialize()

  workers_initialized()