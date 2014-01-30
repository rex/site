Schema = require('../../../drivers/mongo').Schema
_ = require '../../../lib/_'

Plugins = require '../../plugins'

model_config =
  redis_prefix: 'service:instagram:media'
  model_name: 'instagram_media'

NewSchema = new Schema

NewSchema.plugin Plugins.config, model_config
NewSchema.plugin Plugins.redis, model_config

NewSchema.static 'createFrom', (model, callback = ->) ->
  new_item = new this()

  new_item.save (err) ->
    callback err, new_item

module.exports =
  schema: NewSchema
  redis_prefix: model_config.redis_prefix
  model_name: model_config.model_name