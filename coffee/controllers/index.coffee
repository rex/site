logger = require '../lib/logger'
instagram = require '../lib/instagram'
github = require '../lib/github'
config = require '../config'

module.exports = (app) ->
  require('./webhooks') app
  require('./admin') app
  require('./blog') app
  require('./bookmarks') app
  require('./code') app
  require('./portfolio') app
  require('./resume') app
  require('./tools') app
  require('./visits') app
  require('./populate') app
  require('./cron') app

  app.get '/instagram', (req, res) ->
    instagram.users.info({
      user_id: 11843229
      complete: (data, pagination) ->
        res.json
          data: data
          pagination: pagination
    })

  app.get '/env', (req, res) ->
    res.json
      config: config
      env: process.env
      vcap_services: if process.env.VCAP_SERVICES? then JSON.parse process.env.VCAP_SERVICES else "Not running on AppFog"
      vcap_application: if process.env.VCAP_APPLICATION? then JSON.parse process.env.VCAP_APPLICATION else "Not running on AppFog"

  app.get '/github', (req, res) ->
    github.repos (err, body) ->
      res.json
        err: err
        body: body

  app.get '/', (req, res) ->
    github.events (err, body) ->
      if req.json_requested
        res.json body
      else
        res.render 'index',
          uri: req.originalUrl
          time: new Date().toLocaleString()
          pretty: true
          feed: body