Schema = require('../../../drivers/mongo').Schema
_ = require '../../../lib/_'
logger = require '../../../lib/logger'
Redis = require '../../../drivers/redis'

LastFmScrobbleSchema = new Schema
  track_id:
    type: String
  track_name:
    type: String
  album_id:
    type: String
  album_name:
    type: String
  artist_id:
    type: String
  artist_name:
    type: String
  url:
    type: String
  image:
    type: String
  created_on:
    type: Date
    index: true
    default: Date.now

LastFmScrobbleSchema.post 'save', (lastfm_scrobble) ->
  Redis.store_model "service:lastfm:scrobble:#{lastfm_scrobble._id}", lastfm_scrobble.toJSON()

LastFmScrobbleSchema.static 'createFromScrobble', (scrobbled_track, callback = ->) ->
  new_scrobble = new this()

  track_image_object = _.find scrobbled_track.image, size: 'extralarge'
  track_image = track_image_object['#text']

  if _.has scrobbled_track.date, 'uts'
    track_date = _.parse_unix_timestamp scrobbled_track.date.uts
  else
    track_date = Date.now()

  new_scrobble.set
    track_id: scrobbled_track.mbid or undefined
    track_name: scrobbled_track.name
    album_id: scrobbled_track.album.mbid or undefined
    album_name: scrobbled_track.album['#text'] or scrobbled_track.album.name or undefined
    artist_id: scrobbled_track.artist.mbid or undefined
    artist_name: scrobbled_track.artist['#text'] or scrobbled_track.artist.name or undefined
    artist_url: scrobbled_track.artist.url or undefined
    url: scrobbled_track.url or undefined
    image: track_image or undefined
    created_on: track_date

  new_scrobble.save (err, lastfm_scrobble) ->
    if err
      logger.error "Error creating LastFM scrobble", err
    else
      logger "Created LastFM scrobble ##{lastfm_scrobble._id}"

    callback err, lastfm_scrobble

module.exports = LastFmScrobbleSchema