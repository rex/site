redis = require '../drivers/redis'
mongo = require '../drivers/mongo'
_ = require './_'
logger = require './logger'
debug = require('../config').debug

Models =
  Env: mongo.model 'env'
  OAuth_Token: mongo.model 'oauth_token'

module.exports = (next = ->) ->
  Models.Env.find {}, (env_err, env_vars) ->
    Models.OAuth_Token.find { is_env: true }, (token_err, env_tokens) ->
      if env_err then return next env_err
      if token_err then return next token_err

      debug and logger "Loaded #{env_vars.length} env vars:"
      _.each env_vars, (env_var) ->
        debug and logger " > #{env_var.key}"
        process.env[env_var.key] = env_var.val

      debug and logger "Loaded #{env_tokens.length} env tokens:"
      _.each env_tokens, (env_token) ->
        debug and logger " > #{env_token.env_key}"
        process.env[env_token.env_key] = env_token.access_token

      next()