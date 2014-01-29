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

    cronfiles = /\/cron\//
    controllers = /\.\/controllers\//

    _.each files, (file) ->
      if file.match cronfiles
        config.debug and logger "Skipping: #{file}"
        return

      controller = require path.resolve file
      unless _.isFunction controller then return

      Step.start "Loading controller #{file.replace controllers, ''}"
      controller app
      Step.complete()

    Step.groupEnd()

    initialized()