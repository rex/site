async = require 'async'
logger = require '../lib/logger'

Services =
  GitHub: require './github'
  Instagram: require './instagram'
  LastFM: require './lastfm'
  LinkedIn: require './linkedin'
  SoundCloud: require './soundcloud'
  Evernote: require './evernote'

exports.initialize = (services_initialized = ->) ->
  async.series
    GitHub: (done) ->
      Services.GitHub.initialize done
    Instagram: (done) ->
      Services.Instagram.initialize done
    LastFM: (done) ->
      Services.LastFM.initialize done
  , (err, results) ->
    services_initialized err