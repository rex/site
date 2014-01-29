redis = require '../drivers/redis'
mongo = require '../drivers/mongo'
_ = require './_'
logger = require './logger'
debug = require('../config').debug
step = require './step'

Models =
  Env: mongo.model 'env'
  OAuth_Token: mongo.model 'oauth_token'

module.exports = (next = ->) ->
  Models.Env.find {}, (env_err, env_vars) ->
    Models.OAuth_Token.find { is_env: true }, (token_err, env_tokens) ->
      if env_err then return next env_err
      if token_err then return next token_err

      if env_vars.length
        step.group "Loaded #{env_vars.length} env vars:"
        _.each env_vars, (env_var) ->
          debug and console.log " > #{env_var.key}"
          process.env[env_var.key] = env_var.val
        step.groupEnd()

      if env_tokens.length
        step.group "Loaded #{env_tokens.length} env tokens:"
        _.each env_tokens, (env_token) ->
          debug and console.log " > #{env_token.env_key}"
          process.env[env_token.env_key] = env_token.access_token
        step.groupEnd()

      next()