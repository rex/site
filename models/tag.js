var Plugins, Schema, TagSchema, model_config;

Schema = require('../drivers/mongo').Schema;

Plugins = require('./plugins');

model_config = {
  redis_prefix: 'app:tag',
  model_name: 'tag'
};

TagSchema = new Schema({
  name: {
    type: String
  },
  slug: {
    type: String,
    lowercase: true,
    index: true
  }
});

TagSchema.plugin(Plugins.config, model_config);

TagSchema.plugin(Plugins.redis, model_config);

module.exports = {
  schema: TagSchema,
  redis_prefix: model_config.redis_prefix,
  model_name: model_config.model_name
};
