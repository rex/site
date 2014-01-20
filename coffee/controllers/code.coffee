Github_Service = require '../services/github'

module.exports = (app) ->
  app.get '/repos*', (req, res) ->
    Github_Service.fetch_repos (err, body) ->
      res.render 'code/repos',
        repos: body
        uri: req.path

  app.get '/snippets*', (req, res) ->
    res.render 'code/snippets',
      env: process.env
      path: req.path