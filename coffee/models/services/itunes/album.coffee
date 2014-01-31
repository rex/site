Schema = require('../../../drivers/mongo').Schema
_ = require '../../../lib/_'

Plugins = require '../../plugins'

model_config =
  redis_prefix: 'service:itunes:album'
  model_name: 'itunes_album'

NewSchema = new Schema
  artist_id:
    type: Number
  artist:
    type: Schema.Types.ObjectId
    ref: 'itunes_artist'
  collection_id:
    type: Number
  collection_type:
    type: String
  collection_name:
    type: String
  artist_url:
    type: String
  album_url:
    type: String
  album_art:
    type: String
  collection_price:
    type: Number
  explicit:
    type: Boolean
    default: false
  copyright:
    type: String
  genre:
    type: String
  release_date:
    type: Date
  country:
    type: String
  currency:
    type: String
  disc_count:
    type: Number
  tracks: [{
    track_id:
      type: Number
    track_name:
      type: String
    track_url:
      type: String
    preview_url:
      type: String
    track_price:
      type: Number
    disc_number:
      type: Number
    track_number:
      type: Number
    duration:
      type: Number
    radio_url:
      type: String
  }]
  created_on:
    type: Date
  updated_on:
    type: Date
    default: Date.now


NewSchema.plugin Plugins.config, model_config
NewSchema.plugin Plugins.redis, model_config

NewSchema.static 'createFromITunesAlbum', (model, callback = ->) ->
  new_item = new this()

  groups = _.groupBy model.results, (result) ->
    result.wrapperType

  album = _.first groups.collection

  disc_count = _.first(groups.track).discCount

  tracks = _.map groups.track, (track) ->
    {
      track_id: track.trackId
      track_name: track.trackName
      track_url: track.trackViewUrl
      preview_url: track.previewUrl
      track_price: track.trackPrice
      disc_number: track.discNumber
      track_number: track.trackNumber
      duration: Math.floor parseInt track.trackTimeMillis / 1000 # Convert milliseconds to seconds for storage
      radio_url: track.radioStationUrl
    }

  new_item.set
    artist_id: album.artistId
    collection_id: album.collectoinId
    collection_type: album.collectionType
    collection_name: album.collectionName
    artist_url: album.artistViewUrl
    album_url: album.collectionViewUrl
    album_art: album.artworkUrl100
    collection_price: album.collectionPrice
    explicit: if album.collectionExplicitness is 'explicit' then true else false
    copyright: album.copyright
    genre: album.primaryGenreName
    release_date: album.releaseDate
    country: album.country
    currency: album.currency
    disc_count: disc_count
    tracks: tracks
    created_on: Date.now()

  new_item.save (err) ->
    callback err, new_item

module.exports =
  schema: NewSchema
  redis_prefix: model_config.redis_prefix
  model_name: model_config.model_name