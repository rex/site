var ConfigPlugin, Step, config;

Step = require('../../lib/step');

config = require('../../config');

ConfigPlugin = function(schema, options) {
  if (!(options.redis_prefix && options.model_name)) {
    throw new Error("redis_prefix and model_name required for config plugin");
  }
  schema.virtual('redis_prefix').get(function() {
    return options.redis_prefix;
  });
  schema.virtual('model_name').get(function() {
    return options.model_name;
  });
  return schema.virtual('redis_id').get(function() {
    return "" + options.redis_prefix + ":" + (this.get('_id'));
  });
};

module.exports = ConfigPlugin;
