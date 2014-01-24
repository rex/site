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

# Here begins the organized, structured application boot process
async.series
  connect_to_redis: (done) ->
    step.start "Initializing Redis"
    redis = require './drivers/redis'
    redis.initialize ->
      step.complete()
      done()

  initialize_models: (done) ->
    step.start "Initializing Mongo"
    models = require './models'
    models.initialize ->
      step.complete()
      done()

  connect_to_queue: (done) ->
    step.start "Initializing Job Queue"
    queue = require './drivers/queue'
    queue.initialize ->
      step.complete()
      done()

  initialize_workers: (done) ->
    step.start "Initializing Job Queue Workers"
    workers = require './workers'
    workers.initialize ->
      step.complete()
      done()

  env: (done) ->
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

    # Track all visits that are not to /webhooks/*
    app.use require './middleware/log_visit'

    # Create locals based on request data
    app.use require './middleware/set_locals'

    # Render JSON responses if ?json query string parameter is set
    app.use require './middleware/detect_json_requests'

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
