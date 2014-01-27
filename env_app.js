var _;

_ = require('./lib/_');

module.exports = function(after_app_env_loaded) {
  var app_env;
  if (after_app_env_loaded == null) {
    after_app_env_loaded = function() {};
  }
  app_env = {
    PREX_APP_HOST: 'localhost',
    PREX_APP_PORT: 3000,
    PREX_REDIS_HOST: '127.0.0.1',
    PREX_REDIS_PORT: 6379,
    PREX_REDIS_PARAMS: {},
    PREX_REDIS_USERNAME: '',
    PREX_REDIS_PASSWORD: '',
    PREX_MONGO_HOST: 'localhost',
    PREX_MONGO_PORT: 27017,
    PREX_MONGO_DB: 'prex-site',
    PREX_MONGO_USERNAME: '',
    PREX_MONGO_PASSWORD: ''
  };
  _.each(app_env, function(val, key) {
    return process.env[key] = val;
  });
  return after_app_env_loaded();
};
