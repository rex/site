module.exports = (app) ->
  app.post '/cron', (req, res) ->
    body = decodeURIComponent req.body
    interval = body.interval
    res.json
      interval: interval