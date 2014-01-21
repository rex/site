redis = require './redis'
mongoose = require 'mongoose'
_ = require './_'
logger = require './logger'

Env = mongoose.model 'env'

module.exports = (next = ->) ->
  Env.find {}, (err, env_vars) ->
    if err then return next err
    logger "Loaded #{env_vars.length} env vars:"
    _.each env_vars, (env_var) ->
      logger " > #{env_var.key}"
      process.env[env_var.key] = env_var.val

    next()