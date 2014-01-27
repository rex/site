Service = require './base'
mongo = require '../drivers/mongo'
_ = require '../lib/_'
async = require 'async'
logger = require '../lib/logger'
LastFM_API = require '../apis/lastfm'

Models =
  Activity: mongo.model 'activity'
  LastFM_Play: mongo.model 'lastfm_play'

class LastFM extends Service

  initialize: (initialized = ->) ->
    @start_track_stream()
    initialized()

  initialize_track_stream: (track_stream_initialized = ->) ->
    @track_stream = LastFM_API.client.stream LastFM_API.config.username

    @track_stream.on 'lastPlayed', (track) ->

    @track_stream.on 'nowPlaying', (track) ->

    @track_stream.on 'scrobbled', (track) ->
      Models.LastFM_Play.createFromScrobble track

    @track_stream.on 'stoppedPlaying', (track) ->

    @track_stream.on 'error', (err) ->
      console.error "Error in LastFM track stream", err

    track_stream_initialized()

  start_track_stream: (callback = ->) ->
    @initialize_track_stream()
    @track_stream.start()
    callback()

  stop_track_stream: (callback = ->) ->
    @track_stream.stop()
    callback()

  fetch_recent_tracks: (callback = ->) ->

  fetch_loved_tracks: (callback = ->) ->

  fetch_top_tracks: (callback = ->) ->

  fetch_top_albums: (callback = ->) ->

  fetch_top_artists: (callback = ->) ->

  fetch_top_tags: (callback = ->) ->

  fetch_friends: (callback = ->) ->


module.exports = new LastFM