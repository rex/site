auth = require '../lib/auth'

module.exports = (app) ->
  # console.log "App credentials: ", process.env.AUTH_USERNAME, process.env.AUTH_PASSWORD
  app.get '/admin', auth, (req, res) ->
    res.render 'admin/login',
      env: process.env