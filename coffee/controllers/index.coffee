logger = require '../lib/logger'

module.exports = (app) ->
  app.get '/', (req, res) ->
    res.render 'index',
      uri: req.originalUrl
      time: new Date().toLocaleString()
    # , (err, html) ->
    #   if err then logger.error err
    #   logger html

    #   # res.send html

  # app.get '/*', (req, res) ->
  #   logger "Redirecting: #{req.originalUrl}"
  #   res.redirect 301, '/'