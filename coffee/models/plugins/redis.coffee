Redis = require '../../drivers/redis'
Step = require '../../lib/step'
config = require '../../config'

SaveToRedis = (schema, options) ->
  # Step.start "Loading Redis plugin for model #{options.model_name}"
  unless options.redis_prefix then throw new Error "redis_prefix required for Redis plugin"

  schema.post 'save', (doc) ->
    Redis.store_model "#{options.redis_prefix}:#{doc._id}", doc.toJSON()

  # Step.complete()

module.exports = SaveToRedis