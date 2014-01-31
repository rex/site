Schema = require('../../../drivers/mongo').Schema
_ = require '../../../lib/_'

Plugins = require '../../plugins'

model_config =
  redis_prefix: 'service:twitter:media'
  model_name: 'twitter_media'

NewSchema = new Schema
  media_id:
    type: Number
  user:
    type: Schema.Types.ObjectId
    ref: 'twitter_user'
  url:
    href:
      type: String
    link:
      type: String
    display:
      type: String
  media_type:
    type: String
  source_tweet:
    type: Schema.Types.ObjectId
    ref: 'twitter_tweet'
  dimensions:
    thumb:
      h:
        type: Number
      w:
        type: Number
      resize:
        type: String
    small:
      h:
        type: Number
      w:
        type: Number
      resize:
        type: String
    medium:
      h:
        type: Number
      w:
        type: Number
      resize:
        type: String
    large:
      h:
        type: Number
      w:
        type: Number
      resize:
        type: String
  created_on:
    type: Date
  updated_on:
    type: Date
    default: Date.now


NewSchema.plugin Plugins.config, model_config
NewSchema.plugin Plugins.redis, model_config

NewSchema.static 'createFrom', (model, callback = ->) ->
  new_item = new this()

  new_item.set
    media_id: model.id
    url:
      href: model.expanded_url
      link: model.media_url_https
      display: model.url
    media_type: model.type
    dimensions:
      thumb:
        h: model.sizes.thumb.h
        w: model.sizes.thumb.w
        resize: model.sizes.thumb.resize
      small:
        h: model.sizes.small.h
        w: model.sizes.small.w
        resize: model.sizes.small.resize
      medium:
        h: model.sizes.medium.h
        w: model.sizes.medium.w
        resize: model.sizes.medium.resize
      large:
        h: model.sizes.large.h
        w: model.sizes.large.w
        resize: model.sizes.large.resize
    created_on: Date.now()

  new_item.save (err) ->
    callback err, new_item

module.exports =
  schema: NewSchema
  redis_prefix: model_config.redis_prefix
  model_name: model_config.model_name