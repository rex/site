Schema = require('../drivers/mongo').Schema

Plugins = require './plugins'

model_config =
  redis_prefix: 'app:snippet'
  model_name: 'snippet'

SnippetSchema = new Schema
  created_on:
    type: Date
    index: true
  last_updated:
    type: Date
    default: Date.now
  title:
    type: String
    required: true
  slug:
    type: String
  language:
    type: String
  history: [{
    created_on:
      type: Date
    version:
      type: Number
      index: true
    content:
      type: String
  }]
  tags: [{
    type: Schema.Types.ObjectId
    index: true
  }]

SnippetSchema.plugin Plugins.config, model_config
SnippetSchema.plugin Plugins.redis, model_config

module.exports =
  schema: SnippetSchema
  redis_prefix: model_config.redis_prefix
  model_name: model_config.model_name