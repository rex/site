var LastFmPlaySchema, Schema, logger, _;

Schema = require('../../../drivers/mongo').Schema;

_ = require('../../../lib/_');

logger = require('../../../lib/logger');

LastFmPlaySchema = new Schema({
  track_id: {
    type: String
  },
  track_name: {
    type: String
  },
  album_id: {
    type: String
  },
  album_name: {
    type: String
  },
  artist_id: {
    type: String
  },
  artist_name: {
    type: String
  },
  url: {
    type: String
  },
  image: {
    type: String
  },
  created_on: {
    type: Date,
    index: true,
    "default": Date.now
  }
});

LastFmPlaySchema["static"]('createFromScrobble', function(scrobbled_track, callback) {
  var track_date, track_image, track_image_object;
  if (callback == null) {
    callback = function() {};
  }
  track_image_object = _.find(scrobbled_track.image, {
    size: 'extralarge'
  });
  track_image = track_image_object['#text'];
  if (_.has(scrobbled_track.date, 'uts')) {
    track_date = _.parse_unix_timestamp(scrobbled_track.date.uts);
  } else {
    track_date = Date.now();
  }
  return this.create({
    track_id: scrobbled_track.mbid || void 0,
    track_name: scrobbled_track.name,
    album_id: scrobbled_track.album.mbid || void 0,
    album_name: scrobbled_track.album['#text'] || scrobbled_track.album.name || void 0,
    artist_id: scrobbled_track.artist.mbid || void 0,
    artist_name: scrobbled_track.artist['#text'] || scrobbled_track.artist.name || void 0,
    artist_url: scrobbled_track.artist.url || void 0,
    url: scrobbled_track.url || void 0,
    image: track_image || void 0,
    created_on: track_date
  }, function(err, lastfm_play) {
    if (err) {
      logger.error("Error creating LastFM play", err);
    } else {
      logger("Created LastFM play #" + lastfm_play._id);
    }
    return callback(err, lastfm_play);
  });
});

module.exports = LastFmPlaySchema;
