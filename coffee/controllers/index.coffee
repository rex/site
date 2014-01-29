logger = require '../lib/logger'
_ = require '../lib/_'
Step = require '../lib/step'
config = require '../config'
glob = require 'glob'
path = require 'path'

exports.initialize = (app, initialized = ->) ->
  Step.group "Load Controllers"

  glob './controllers/**/*.js', (err, files) ->
    if err then return console.error "Glob error", err

    controllers = /\.\/controllers\//

    _.each files, (file) ->
      if file.match /\/cron\//
        config.debug and logger "Skipping: #{file}"
        return

      Step.start "Loading controller #{file.replace controllers, ''}"
      controller = require path.resolve file
      unless _.isFunction controller then return

      controller app
      Step.complete()

    Step.groupEnd()

    initialized()