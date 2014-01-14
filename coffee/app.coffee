# Require first to ensure proper instantiation of the winston CLI logger
logger = require './lib/logger'
_ = require './lib/_'
express = require 'express'
http = require 'http'
app = express()

app.configure ->
  app.set 'port', process.env.VCAP_APP_PORT or 3000
  app.engine 'jade', require('jade').__express
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

  # Create locals based on request data
  app.use (req, res, next) ->
    res.locals.req =
      xhr: req.xhr
      path: req.originalUrl
      pjax: if req.headers['X-PJAX']? then true else false
    res.locals._ = _
    res.locals.me = "Pierce"
    next()

  app.use app.router

app.configure 'development', ->
  app.use express.errorHandler()

app.configure 'production', ->

require('./controllers') app

server = http.createServer(app).listen app.get('port'), () ->
  logger "prex.io running on port #{app.get 'port'}"

logger "Loaded Routes:"

_.each app.routes, (methods, verb) ->
  console.log "#{verb} methods: (#{methods.length})"
  _.each _.pluck(methods, 'path'), (path) ->
    console.log " > #{path}"