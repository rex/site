logger = require '../lib/logger'

module.exports = (app) ->
  app.post '/cron', (req, res) ->
    unless req.body.interval then return logger.error "No cron interval specified"

    interval = req.body.interval.toString()

    if interval in ['5m','15m','1h','12h','24h','7d','30d'] then require("./cron/#{interval}")() else logger.error "Invalid cron attempted: #{interval}"
    res.send 200