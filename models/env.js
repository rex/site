var EnvSchema, Plugins, Redis, Schema, model_config;

Schema = require('../drivers/mongo').Schema;

Redis = require('../drivers/redis');

Plugins = require('./plugins');

model_config = {
  redis_prefix: 'app:env',
  model_name: 'env',
  db_name: 'env_vars'
};

EnvSchema = new Schema({
  created_on: {
    type: Date,
    "default": Date.now
  },
  key: {
    type: String,
    uppercase: true,
    index: {
      unique: true
    }
  },
  val: {
    type: String
  }
});

EnvSchema.post('save', function(env_var) {
  return Redis.set(env_var.key, env_var.val);
});

EnvSchema.plugin(Plugins.config, model_config);

module.exports = {
  schema: EnvSchema,
  redis_prefix: model_config.redis_prefix,
  model_name: model_config.model_name
};
