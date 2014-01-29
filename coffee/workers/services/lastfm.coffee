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
    Queue.add_handlers @queue_name,
      track_scrobbled: @handle_scrobble
      track_loved: @handle_loved_track
      track_banned: @handle_banned_track
      friend_added: @handle_new_friend
      shout_received: @handle_shout

    initialized()

  handle_scrobble: (track, callback = ->) ->
    async.waterfall [
      (done) ->
        Models.LastFM_Scrobble.createFromScrobble track.data, done
      (lastfm_scrobble, done) ->
        Models.Activity.create
          created_on: lastfm_scrobble.created_on
          redis_key: lastfm_scrobble.redis_id
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