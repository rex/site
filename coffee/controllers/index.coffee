logger = require '../lib/logger'
instagram = require '../lib/instagram'
github = require '../lib/github'

module.exports = (app) ->
  require('./webhooks') app

  app.get '/instagram', (req, res) ->
    instagram.users.info({
      user_id: 11843229
      complete: (data, pagination) ->
        res.json
          data: data
          pagination: pagination
    })
  app.get '/env', (req, res) ->
    res.json process.env

  app.get '/github', (req, res) ->
    github.repos (err, body) ->
      res.json
        err: err
        body: body

  app.get '/code', (req, res) ->
    github.repos (err, body) ->
      res.render 'code',
        repos: body
        uri: req.originalUrl

  app.get '/', (req, res) ->
    github.events (err, body) ->
      res.render 'index',
        uri: req.originalUrl
        time: new Date().toLocaleString()
        pretty: true
        feed: body