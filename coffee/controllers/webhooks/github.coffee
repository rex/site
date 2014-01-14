logger = require '../../lib/logger'
mongoose = require 'mongoose'
Activity = mongoose.model 'activity'

module.exports = (app) ->
  app.post '/webhooks/github', (req, res) ->
    logger "Received github webhook!"

    payload = JSON.parse decodeURIComponent req.body.payload

    activity = new Activity()
    logger "Creating activity"
    activity.fromGithubWebhook payload, (err) ->
      if err
        res.json
          err: err
      else
        res.json
          success: true