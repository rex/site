logger = require '../../lib/logger'
Github_Service = require '../../services/github'

module.exports = (app) ->
  app.post '/webhooks/github', (req, res) ->
    logger "Received github webhook!"

    payload = JSON.parse decodeURIComponent req.body.payload

    Github_Service.process_webhook_activity payload, (err) ->
      if err
        res.json
          err: err
      else
        res.json
          success: true