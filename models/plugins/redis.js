var Redis, SaveToRedis, Step, config;

Redis = require('../../drivers/redis');

Step = require('../../lib/step');

config = require('../../config');

SaveToRedis = function(schema, options) {
  if (!options.redis_prefix) {
    throw new Error("redis_prefix required for Redis plugin");
  }
  return schema.post('save', function(doc) {
    return Redis.store_model("" + options.redis_prefix + ":" + doc._id, doc.toJSON());
  });
};

module.exports = SaveToRedis;
