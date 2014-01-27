Schema = require('../../../drivers/mongo').Schema
_ = require '../../../lib/_'
logger = require '../../../lib/logger'

LastFmPlaySchema = new Schema
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

LastFmPlaySchema.static 'createFromScrobble', (scrobbled_track, callback = ->) ->
  track_image_object = _.find scrobbled_track.image, size: 'extralarge'
  track_image = track_image_object['#text']

  if _.has scrobbled_track.date, 'uts'
    track_date = _.parse_unix_timestamp scrobbled_track.date.uts
  else
    track_date = Date.now()

  this.create
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
  , (err, lastfm_play) ->
    if err
      logger.error "Error creating LastFM play", err
    else
      logger "Created LastFM play ##{lastfm_play._id}"

    callback err, lastfm_play

module.exports = LastFmPlaySchema