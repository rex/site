github = require '../../lib/github'
logger = '../../lib/logger'
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
      github.activity (err, body) ->
        if err then return done err
        _.each body, (activity) ->
          #

  , (err, results) ->
    if err
      res.json 500,
        err: err
    else
      res.json
        results: results