github = require '../lib/github'

module.exports = (app) ->
  app.get '/repos*', (req, res) ->
    github.repos (err, body) ->
      res.render 'code/repos',
        repos: body
        uri: req.path

  app.get '/snippets*', (req, res) ->
    res.render 'code/snippets',
      env: process.env
      path: req.path