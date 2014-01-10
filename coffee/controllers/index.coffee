logger = require '../lib/logger'

module.exports = (app) ->
  app.get '/', (req, res) ->
    res.send "Hello and welcome to this fully functioning site!"

  # app.get '/*', (req, res) ->
  #   logger "Redirecting: #{req.originalUrl}"
  #   res.redirect 301, '/'