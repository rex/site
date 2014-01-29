Service = require './base'
_ = require '../lib/_'
logger = require '../lib/logger'
LastFmNode = require('lastfm').LastFmNode
Queue = require '../drivers/queue'

class LastFM extends Service

  initialize: (initialized = ->) ->
    @config =
      api_key: process.env.LASTFM_API_KEY
      api_secret: process.env.LASTFM_API_SECRET
      username: process.env.LASTFM_USERNAME

    @client = new LastFmNode
      api_key: @config.api_key
      api_secret: @config.api_secret
      useragent: 'prex.io'

    @start_track_stream()
    initialized()

  initialize_track_stream: (track_stream_initialized = ->) ->
    @track_stream = @client.stream @config.username

    @track_stream.on 'lastPlayed', (track) ->

    @track_stream.on 'nowPlaying', (track) ->

    @track_stream.on 'scrobbled', (track) ->
      Queue.add_job
        queue_name: 'service:lastfm'
        job_name: 'track_scrobbled'
        job_data: track

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

  fetch_user: (callback = ->) ->


module.exports = new LastFM