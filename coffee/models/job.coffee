Schema = require('../drivers/mongo').Schema

Plugins = require './plugins'

model_config =
  redis_prefix: 'app:job'
  model_name: 'job'

JobSchema = new Schema
  created_on:
    type: Date
    default: Date.now
    index: true
  title:
    type: String
  company:
    type: String
  project:
    type: String
  date_started:
    type: Date
  date_ended:
    type: Date
  city:
    type: String
  state:
    type: String
  image:
    type: String
  summary:
    type: String
  tasks: [{
    type: String
  }]
  tags:
    type: Array
    default: []
    index: true
  current:
    type: Boolean
    default: false
  visible:
    type: Boolean
    default: true

JobSchema.plugin Plugins.config, model_config
JobSchema.plugin Plugins.redis, model_config

module.exports =
  schema: JobSchema
  redis_prefix: model_config.redis_prefix
  model_name: model_config.model_name