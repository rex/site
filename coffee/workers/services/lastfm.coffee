BaseWorker = require '../base'
Queue = require '../../drivers/queue'
Mongo = require '../../drivers/mongo'
logger = require '../../lib/logger'
async = require 'async'

Models =
  Activity: Mongo.model 'activity'
  LastFM_Scrobble: Mongo.model 'lastfm_scrobble'

class LastFM extends BaseWorker

  initialize: (initialized = ->) ->
    @queue_name = "service:lastfm"

    # Create the queue
    Queue.add_queue @queue_name

    # Add our handlers

    # Srobbles
    Queue.add_handler
      queue_name: @queue_name
      job_name: 'track_scrobbled'
      handler: @handle_scrobble

    # Loved tracks
    Queue.add_handler
      queue_name: @queue_name
      job_name: 'track_loved'
      handler: @handle_loved_track

    # Banned tracks
    Queue.add_handler
      queue_name: @queue_name
      job_name: 'track_banned'
      handler: @handle_banned_track

    # New friends
    Queue.add_handler
      queue_name: @queue_name
      job_name: 'friend_added'
      handler: @handle_new_friend

    # Shouts
    Queue.add_handler
      queue_name: @queue_name
      job_name: 'shout_received'
      handler: @handle_shout

    initialized()

  handle_scrobble: (track, callback = ->) ->
    async.waterfall [
      (done) ->
        Models.LastFM_Scrobble.createFromScrobble track.data, done
      (lastfm_scrobble, done) ->
        Models.Activity.create
          created_on: lastfm_scrobble.created_on
          redis_key: "service:lastfm:scrobble:#{lastfm_scrobble._id}"
        , done
    ], callback

  handle_loved_track: (track, callback = ->) ->
    logger "Handling loved track"
    callback()

  handle_banned_track: (track, callback = ->) ->
    logger "Handling banned track"
    callback()

  handle_new_friend: (user, callback = ->) ->
    logger "Handling new friend"
    callback()

  handle_shout: (shout, callback = ->) ->
    logger "Handling shout"
    callback()


module.exports = new LastFM