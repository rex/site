var Models, debug, logger, mongo, redis, step, _;

redis = require('../drivers/redis');

mongo = require('../drivers/mongo');

_ = require('./_');

logger = require('./logger');

debug = require('../config').debug;

step = require('./step');

Models = {
  Env: mongo.model('env'),
  OAuth_Token: mongo.model('oauth_token')
};

module.exports = function(next) {
  if (next == null) {
    next = function() {};
  }
  return Models.Env.find({}, function(env_err, env_vars) {
    return Models.OAuth_Token.find({
      is_env: true
    }, function(token_err, env_tokens) {
      if (env_err) {
        return next(env_err);
      }
      if (token_err) {
        return next(token_err);
      }
      if (env_vars.length) {
        step.group("Loaded " + env_vars.length + " env vars:");
        _.each(env_vars, function(env_var) {
          debug && console.log(" > " + env_var.key);
          return process.env[env_var.key] = env_var.val;
        });
        step.groupEnd();
      }
      if (env_tokens.length) {
        step.group("Loaded " + env_tokens.length + " env tokens:");
        _.each(env_tokens, function(env_token) {
          debug && console.log(" > " + env_token.env_key);
          return process.env[env_token.env_key] = env_token.access_token;
        });
        step.groupEnd();
      }
      return next();
    });
  });
};
