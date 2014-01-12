module.exports = (app) ->
  app.get '/webhooks', (req, res) ->
    res.json
      instagram: "aight"
      github: "fuck yeah"
      twitter: "you fuckin know it"

  app.post '/webhooks/instagram', (req, res) ->

  app.post '/webhooks/github', (req, res) ->

  app.post '/webhooks/twitter', (req, res) ->