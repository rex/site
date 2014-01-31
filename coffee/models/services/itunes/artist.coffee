Schema = require('../../../drivers/mongo').Schema
_ = require '../../../lib/_'

Plugins = require '../../plugins'

model_config =
  redis_prefix: 'service:itunes:artist'
  model_name: 'itunes_artist'

NewSchema = new Schema
  artist_id:
    type: Number
  artist_name:
    type: String
  artist_url:
    type: String
  radio_url:
    type: String
  genre:
    type: String
  genre_id:
    type: Number
  albums: [
    type: Schema.Types.ObjectId
    ref: 'itunes_album'
  ]
  created_on:
    type: Date
  updated_on:
    type: Date
    default: Date.now

NewSchema.plugin Plugins.config, model_config
NewSchema.plugin Plugins.redis, model_config

NewSchema.static 'createFromITunesArtist', (model, callback = ->) ->
  new_item = new this()

  new_item.set
    artist_id: model.artistId
    artist_name: model.artistName
    artist_url: model.artistLinkUrl
    radio_url: model.radioStationUrl
    genre: model.primaryGenreName
    genre_id: model.primaryGenreId
    created_on: Date.now()

  new_item.save (err) ->
    callback err, new_item

module.exports =
  schema: NewSchema
  redis_prefix: model_config.redis_prefix
  model_name: model_config.model_name