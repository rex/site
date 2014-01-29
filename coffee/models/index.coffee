mongo = require '../drivers/mongo'
config = require '../config'
logger = require '../lib/logger'
_ = require '../lib/_'
Step = require '../lib/step'
glob = require 'glob'
path = require 'path'

exports.initialize = (after_connected = ->) ->
  Step.group "Load Models"

  glob "./models/**/*.js", (err, files) ->
    if err then console.error "Glob error", err

    console.debug and console.log "Glob files", files

    _.each files, (file) ->
      if file.match /\/plugins\//
        config.debug and logger "Skipping: #{file}"
        return

      model = require path.resolve file
      unless model.model_name then return

      Step.start "Loading model: #{model.model_name}"
      if model.db_name
        mongo.model model.model_name, model.schema, model.db_name
      else
        mongo.model model.model_name, model.schema

      loaded_model = mongo.model model.model_name
      doc = new loaded_model()
      if doc.model_name is model.model_name then Step.complete() else Step.fail "Model name not loaded: #{model.model_name}"

    Step.groupEnd()

  # Connect to Mongo
  mongo.initialize after_connected