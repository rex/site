var LinkSchema, Plugins, Schema, model_config;

Schema = require('../drivers/mongo').Schema;

Plugins = require('./plugins');

model_config = {
  redis_prefix: 'app:link',
  model_name: 'link'
};

LinkSchema = new Schema({
  created_on: {
    type: Date
  },
  last_updated: {
    type: Date,
    "default": Date.now
  },
  title: {
    type: String
  },
  href: {
    type: String
  },
  icon: {
    type: String
  },
  visible: {
    type: Boolean,
    "default": true
  }
});

LinkSchema.plugin(Plugins.config, model_config);

LinkSchema.plugin(Plugins.redis, model_config);

module.exports = {
  schema: LinkSchema,
  redis_prefix: model_config.redis_prefix,
  model_name: model_config.model_name
};
