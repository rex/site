LastFmNode = require('lastfm').LastFmNode
async = require 'async'
mongo = require '../drivers/mongo'
logger = require '../lib/logger'
API = require './base'

Models =
  Activity: mongo.model 'activity'
  LastFM_Play: mongo.model 'lastfm_play'

class LastFM extends API

  constructor: ->
    @config =
      api_key: process.env.LASTFM_API_KEY
      api_secret: process.env.LASTFM_API_SECRET
      username: process.env.LASTFM_USERNAME

    @client = new LastFmNode
      api_key: @config.api_key
      secret: @config.api_secret
      useragent: 'prex.io'

  recent_tracks: (callback = ->) ->


module.exports = new LastFM