async = require 'async'
logger = require '../lib/logger'

Services =
  Evernote: require './evernote'
  GitHub: require './github'
  Instagram: require './instagram'
  LastFM: require './lastfm'
  LinkedIn: require './linkedin'
  SoundCloud: require './soundcloud'

exports.initialize = (services_initialized = ->) ->
  async.series
    Evernote: (done) ->
      Services.Evernote.initialize done
    GitHub: (done) ->
      Services.GitHub.initialize done
    Instagram: (done) ->
      Services.Instagram.initialize done
    LastFM: (done) ->
      Services.LastFM.initialize done
    LinkedIn: (done) ->
      Services.LinkedIn.initialize done
    SoundCloud: (done) ->
      Services.SoundCloud.initialize done

  , (err, results) ->
    services_initialized err