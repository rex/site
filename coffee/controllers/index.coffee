logger = require '../lib/logger'
instagram = require '../lib/instagram'
config = require '../config'
mongoose = require 'mongoose'

Services =
  Github: require '../services/github'
  Instagram: require '../services/instagram'

Models =
  activity: mongoose.model 'activity'

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
    Services.Instagram.fetch_recent_activity (err, images) ->
      if err
        res.send 500, err
      else
        res.json images

  app.get '/env', (req, res) ->
    res.json
      config: config
      env: process.env
      vcap_services: if process.env.VCAP_SERVICES? then JSON.parse process.env.VCAP_SERVICES else "Not running on AppFog"
      vcap_application: if process.env.VCAP_APPLICATION? then JSON.parse process.env.VCAP_APPLICATION else "Not running on AppFog"

  app.get '/github/activity', (req, res) ->
    Services.Github.fetch_recent_activity (err, activity) ->
      if err
        res.send 500, err
      else
        res.json activity

  app.get '/github/repos', (req, res) ->
    Services.Github.fetch_repos (err, body) ->
      res.json
        err: err
        body: body

  app.get '/', (req, res) ->
    Models.activity
      .find()
      .sort
        created_on: 'desc'
      .exec (err, body) ->
        if req.json_requested
          res.json body
        else
          res.render 'index',
            uri: req.originalUrl
            time: new Date().toLocaleString()
            pretty: true
            feed: body