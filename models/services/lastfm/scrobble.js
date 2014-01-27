var LastFmScrobbleSchema, Redis, Schema, logger, _;

Schema = require('../../../drivers/mongo').Schema;

_ = require('../../../lib/_');

logger = require('../../../lib/logger');

Redis = require('../../../drivers/redis');

LastFmScrobbleSchema = new Schema({
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

LastFmScrobbleSchema.post('save', function(lastfm_scrobble) {
  return Redis.store_model("service:lastfm:scrobble:" + lastfm_scrobble._id, lastfm_scrobble.toJSON());
});

LastFmScrobbleSchema["static"]('createFromScrobble', function(scrobbled_track, callback) {
  var new_scrobble, track_date, track_image, track_image_object;
  if (callback == null) {
    callback = function() {};
  }
  new_scrobble = new this();
  track_image_object = _.find(scrobbled_track.image, {
    size: 'extralarge'
  });
  track_image = track_image_object['#text'];
  if (_.has(scrobbled_track.date, 'uts')) {
    track_date = _.parse_unix_timestamp(scrobbled_track.date.uts);
  } else {
    track_date = Date.now();
  }
  new_scrobble.set({
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
  });
  return new_scrobble.save(function(err, lastfm_scrobble) {
    if (err) {
      logger.error("Error creating LastFM scrobble", err);
    } else {
      logger("Created LastFM scrobble #" + lastfm_scrobble._id);
    }
    return callback(err, lastfm_scrobble);
  });
});

module.exports = LastFmScrobbleSchema;
