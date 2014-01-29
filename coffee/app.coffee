# Require first to ensure proper instantiation of the winston CLI logger
logger = require './lib/logger'
_ = require './lib/_'
async = require 'async'
express = require 'express'
http = require 'http'
step = require './lib/step'
config = require './config'
colors = config.colors
debug = config.debug

app = express()

# Here begins the organized, structured application boot process
async.series
  load_app_env: (done) ->
    step.start_major "Loading app config into environment"
    env_app = require('./env_app') ->
      step.complete_major()
      done()

  load_app_into_config: (done) ->
    step.start_major "Reloading app config"
    config.load_app_config ->
      step.complete_major()
      done()

  connect_to_redis: (done) ->
    step.start_major "Initializing Redis"
    redis = require './drivers/redis'
    redis.initialize ->
      step.complete_major()
      done()

  initialize_models: (done) ->
    step.start_major "Initializing Mongo"
    models = require './models'
    models.initialize ->
      step.complete_major()
      done()

  env_services: (done) ->
    step.start_major "Update service credentials in database"
    require('./env_services') ->
      step.complete_major()
      done()

  load_env: (done) ->
    step.start_major "Loading service credentials into environment"
    require('./lib/load_env') ->
      step.complete_major()
      done()

  load_credentials_into_config: (done) ->
    step.start_major "Load service credentials into config"
    config.load_services ->
      step.complete_major()
      done()

  configure_app: (done) ->
    step.start_major "Configuring application"
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

      step.complete_major()
      done()

  initialize_redis_session: (done) ->
    step.start_major "Initializing Redis Session"
    Redis_Instance = require('./drivers/redis').instance
    unless Redis_Instance
      err = new Error "No Redis instance found"
      step.fail err
      return done err, null

    Redis_Store = require('connect-redis') express

    app.use express.session
      store: new Redis_Store
        client: Redis_Instance
      secret: 'go rangers'

    step.complete_major()
    done()

  connect_to_queue: (done) ->
    step.start_major "Initializing Job Queue"
    queue = require './drivers/queue'
    queue.initialize ->
      step.complete_major()
      done()

  initialize_workers: (done) ->
    step.start_major "Initializing Job Queue Workers"
    workers = require './workers'
    workers.initialize ->
      step.complete_major()
      done()

  initialize_services: (done) ->
    step.start_major "Initializing Services"
    services = require './services'
    services.initialize (err) ->
      if err? then step.error err else step.complete_major()
      done err

  attach_middleware: (done) ->
    step.start_major "Attaching application middleware"

    # Track all visits that are not to /webhooks/*
    app.use require './middleware/log_visit'

    # Create locals based on request data
    app.use require './middleware/set_locals'

    # Render JSON responses if ?json query string parameter is set
    app.use require './middleware/detect_json_requests'

    # Display all session information for each request
    app.use require './middleware/debug_session'

    app.use app.router

    step.complete_major()
    done()

  post_middleware: (done) ->
    step.start_major "Running post-middleware hook"
    app.configure 'development', ->
      app.use express.errorHandler()

    app.configure 'production', ->

    step.complete_major()
    done()

  init_controllers: (done) ->
    step.start_major "Initializing controllers"
    controllers = require('./controllers')
    controllers.initialize app, ->

      step.complete_major()
      done()

  display_routes: (done) ->
    unless config.debug then return done()

    step.group "Loaded Routes"

    _.each app.routes, (methods, verb) ->
      _.each _.pluck(methods, 'path'), (path) ->
        switch verb
          when 'get' then color = colors.blue
          when 'put' then color = colors.teal
          when 'post' then color = colors.green
          when 'delete' then color = colors.red

        logger " > #{color}#{verb.toUpperCase()}#{colors.reset} #{path}"

    step.groupEnd()
    done()

, (err, results) ->
  if err then logger.error err
  else
    step.start_major "Booting application"
    server = http.createServer(app).listen app.get('port'), app.get('host'), () ->
      step.complete_major()
      logger "prex.io running at #{app.get 'host'} on port #{app.get 'port'}"
