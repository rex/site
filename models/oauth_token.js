var OAuthTokenSchema, Plugins, Schema, model_config;

Schema = require('../drivers/mongo').Schema;

Plugins = require('./plugins');

model_config = {
  redis_prefix: 'app:oauth_token',
  model_name: 'oauth_token'
};

OAuthTokenSchema = new Schema({
  service: {
    type: String,
    required: true,
    index: true
  },
  auth_code: {
    type: String
  },
  api_key: {
    type: String
  },
  api_secret: {
    type: String
  },
  client_id: {
    type: String
  },
  client_secret: {
    type: String
  },
  access_token: {
    type: String
  },
  created_on: {
    type: Date,
    "default": Date.now
  },
  active: {
    type: Boolean,
    "default": true
  },
  is_env: {
    type: Boolean,
    "default": false,
    index: true
  },
  env_key: {
    type: String,
    index: true
  },
  meta: {
    type: Object
  }
});

OAuthTokenSchema.plugin(Plugins.config, model_config);

OAuthTokenSchema.plugin(Plugins.redis, model_config);

module.exports = {
  schema: OAuthTokenSchema,
  redis_prefix: model_config.redis_prefix,
  model_name: model_config.model_name
};
