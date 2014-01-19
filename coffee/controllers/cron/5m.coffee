github = require '../../lib/github'
logger = require '../../lib/logger'
_ = require '../../lib/_'
mongoose = require 'mongoose'
async = require 'async'

Models =
  activity: mongoose.model 'activity'

module.exports = ->
  logger "Cron running: 5m"

  async.parallel

    # Retrieve latest github activity
    github_activity: (done) ->
      logger "Processing recent github activity..."
      github.events (err, body) ->
        if err then return done err
        _.each body, (activity) ->
          logger "Processing activity ##{activity.id}"

        done()

  , (err, results) ->
    if err
      logger.error err
    else
      logger "5m cron complete!", results