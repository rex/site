# Require first to ensure proper instantiation of the winston CLI logger
logger = require './lib/logger'
_ = require './lib/_'
async = require 'async'
express = require 'express'
http = require 'http'
step = require './lib/step'
config = require './config'
debug = config.debug

app = express()

# Let's instantiate our Redis connection
redis = require './drivers/redis'
mongo = require './drivers/mongo'

# Here begins the organized, structured application boot process
async.series
  connect_to_redis: (done) ->
    step.start "Connecting to Redis"
    redis.initialize ->
      step.complete()
      done()

  initialize_models: (done) ->
    # Here we instantiate our models
    step.start "Initializing Mongo"
    models = require './models'
    models.initialize ->
      step.complete()
      done()

  env: (done) ->
    # Very, VERY important: Initialize our environment variables
    step.start "Update environment variables in database"
    require('./env') ->
      step.complete()
      done()

  load_env: (done) ->
    step.start "Loading environment variables"
    require('./lib/load_env') ->
      step.complete()
      done()

  configure_app: (done) ->
    step.start "Configuring application"
    app.configure ->
      app.set 'port', config.app.port or 3000
      app.set 'host', config.app.host or 'localhost'
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
      app.use express.json()
      app.use express.urlencoded()
      app.use express.methodOverride()

      step.complete()
      done()


  attach_middleware: (done) ->
    step.start "Attaching application middleware"
    # Use the Visit Model's middleware
    Visit = mongo.model 'visit'
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

    step.complete()
    done()

  post_middleware: (done) ->
    step.start "Running post-middleware hook"
    app.configure 'development', ->
      app.use express.errorHandler()

    app.configure 'production', ->

    step.complete()
    done()

  init_controllers: (done) ->
    step.start "Initializing controllers"
    require('./controllers') app

    step.complete()
    done()

  display_routes: (done) ->
    if debug
      logger "Loaded Routes:"

      _.each app.routes, (methods, verb) ->
        logger "#{verb} methods: (#{methods.length})"
        _.each _.pluck(methods, 'path'), (path) ->
          logger " > #{path}"

    done()

, (err, results) ->
  if err then logger.error err
  else
    step.start "Booting application"
    server = http.createServer(app).listen app.get('port'), app.get('host'), () ->
      step.complete()
      logger "prex.io running at #{app.get 'host'} on port #{app.get 'port'}"
