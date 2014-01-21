# Require first to ensure proper instantiation of the winston CLI logger
logger = require './lib/logger'
mongoose = require 'mongoose'
_ = require './lib/_'
express = require 'express'
http = require 'http'
app = express()

# Let's instantiate our Redis connection
redis = require './lib/redis'

# Here we instantiate our models
models = require './models'
models.initialize ->
  # This fires after Mongoose fully connects, not necessarily in this order.
  #
  # Very, VERY important: Initialize our environment variables
  env = require('./env') ->
    require('./lib/load_env')()

Visit = mongoose.model 'visit'

app.configure ->
  app.set 'port', process.env.VCAP_APP_PORT or 3000
  app.set 'host', process.env.VCAP_APP_HOST or 'localhost'
  app.engine 'jade', require('jade').__express
  app.enable 'trust proxy'
  app.disable 'view cache'
  app.set 'view engine', 'jade'
  app.set 'views', "#{process.cwd()}/views"
  app.use express.compress()
  app.use express.favicon "#{__dirname}/public/images/favicon.ico"
  app.use express.static "#{__dirname}/public"
  app.use express.logger('short')
  app.use express.cookieParser()
  app.use express.bodyParser()
  app.use express.methodOverride()

  # Use the Visit Model's middleware
  app.use (req, res, next) ->
    if req.path.match /^\/webhooks/
      logger "Skipping webhook request: #{req.path.replace '/webhooks/', ''}"
      next()
    else
      visit = new Visit
      visit.createFromRequest req, res, next

  # Create locals based on request data
  app.use (req, res, next) ->
    req.isPJAX = if req.headers['X-PJAX']? then true else false
    res.locals.req =
      xhr: req.xhr
      path: req.originalUrl
      isPJAX: req.isPJAX
    res.locals._ = _
    res.locals.me = "Pierce"
    next()

  # Render JSON responses if ?json query string parameter is set
  app.use (req, res, next) ->
    if req.query
      logger "Query string params:", req.query

    if _.has req.query, 'json'
      logger "JSON response requested for URL: #{req.originalUrl}"
      req.json_requested = true

    next()

  app.use app.router

app.configure 'development', ->
  app.use express.errorHandler()

app.configure 'production', ->

require('./controllers') app

server = http.createServer(app).listen app.get('port'), app.get('host'), () ->
  logger "prex.io running at #{app.get 'host'} on port #{app.get 'port'}"

logger "Loaded Routes:"

_.each app.routes, (methods, verb) ->
  logger "#{verb} methods: (#{methods.length})"
  _.each _.pluck(methods, 'path'), (path) ->
    logger " > #{path}"