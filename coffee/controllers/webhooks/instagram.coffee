instagram = require '../../services/instagram'

module.exports = (app) ->
  app.post '/webhooks/instagram', (req, res) ->

  app.get '/instagram/likes', (req, res) ->
    instagram.fetch_recent_likes (err, data) ->
      if err then res.send 500, err
      else res.json data