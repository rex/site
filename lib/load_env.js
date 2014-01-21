var Env, logger, mongoose, redis, _;

redis = require('./redis');

mongoose = require('mongoose');

_ = require('./_');

logger = require('./logger');

Env = mongoose.model('env');

module.exports = function(next) {
  if (next == null) {
    next = function() {};
  }
  return Env.find({}, function(err, env_vars) {
    if (err) {
      return next(err);
    }
    logger("Loaded " + env_vars.length + " env vars:");
    _.each(env_vars, function(env_var) {
      logger(" > " + env_var.key);
      return process.env[env_var.key] = env_var.val;
    });
    return next();
  });
};
