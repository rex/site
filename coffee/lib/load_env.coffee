yaml = require 'js-yaml'
fs = require 'fs'
_ = require './_'
config = require '../config'
env_path = "#{process.cwd()}/.env"

module.exports = (env_loaded = ->) ->
  env = yaml.safeLoad fs.readFileSync env_path, 'utf8'

  _.each env, (section, name) ->
    _.each section, (subsection, prefix) ->
      _.each subsection, (val, key) ->
        env_key = "#{prefix}_#{key}".toUpperCase()
        # console.log " > > #{env_key} = #{val}"
        process.env[env_key] = val

  config.load_app_config env_loaded