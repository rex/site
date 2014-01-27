BaseWorker = require '../base'

class LastFM extends BaseWorker

  initialize: (initialized = ->) ->

  handle_scrobble: (callback = ->) ->

  handle_loved_track: (callback = ->) ->

  handle_banned_track: (callback = ->) ->

  handle_new_friend: (callback = ->) ->

  handle_shout: (callback = ->) ->


module.exports = new LastFM