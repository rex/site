Step = require '../../lib/step'
config = require '../../config'

ConfigPlugin = (schema, options) ->
  # Step.start "Loading config plugin for #{options.model_name}"
  unless options.redis_prefix and options.model_name then throw new Error "redis_prefix and model_name required for config plugin"

  schema.virtual('redis_prefix').get ->
    options.redis_prefix

  schema.virtual('model_name').get ->
    options.model_name

  schema.virtual('redis_id').get ->
    "#{options.redis_prefix}:#{this.get '_id'}"

  # Step.complete()

module.exports = ConfigPlugin