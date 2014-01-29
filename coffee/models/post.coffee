Schema = require('../drivers/mongo').Schema

Plugins = require './plugins'

model_config =
  redis_prefix: 'app:post'
  model_name: 'post'

PostSchema = new Schema
  created_on:
    type: Date
    index: true
  last_updated:
    type: Date
    default: Date.now
    index: true
  title:
    type: String
    required: true
  slug:
    type: String
  tags: [{
    type: Schema.Types.ObjectId
    index: true
  }]
  history: [{
    created_on:
      type: Date
    version:
      type: Number
      index: true
    content:
      type: String
      default: ''
  }]

PostSchema.plugin Plugins.config, model_config
PostSchema.plugin Plugins.redis, model_config

module.exports =
  schema: PostSchema
  redis_prefix: model_config.redis_prefix
  model_name: model_config.model_name
