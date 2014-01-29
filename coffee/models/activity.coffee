Schema = require('../drivers/mongo').Schema

Plugins = require './plugins'

model_config =
  redis_prefix: "app:activity"
  model_name: 'activity'
  db_name: 'activities'

ActivitySchema = new Schema
  created_on:
    type: Date
    required: true
    index: true
  redis_key:
    type: String
    required: true
    index:
      unique: true
  visible:
    type: Boolean
    default: true

ActivitySchema.plugin Plugins.config, model_config
# Not loading activity into redis

module.exports =
  schema: ActivitySchema
  redis_prefix: model_config.model_name
  model_name: model_config.model_name