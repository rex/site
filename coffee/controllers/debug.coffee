logger = require '../lib/logger'
_ = require '../lib/_'
config = require '../config'
mongo = require '../drivers/mongo'
Redis = require '../drivers/redis'

Services =
  Github: require '../services/github'
  Instagram: require '../services/instagram'
  Twitter: require '../services/twitter'

generic_callback = (err, body) ->
  res.json
    err: err
    body: body

module.exports = (app) ->
  app.get '/instagram', (req, res) ->
    Services.Instagram.fetch_recent_activity (err, images) ->
      if err
        res.send 500, err
      else
        res.json images

  app.get '/redis', (req, res) ->
    logger "Fetching all keys"
    Redis.list_keys (err, keys) ->
      console.error err if err
      else res.json keys

  app.get '/env', (req, res) ->
    res.json
      config: config
      env: process.env

  app.get '/github/activity', (req, res) ->
    Services.Github.fetch_recent_activity res.generic_callback

  app.get '/github/repos', (req, res) ->
    Services.Github.fetch_repos res.generic_callback

  app.get '/github/user/:login', (req, res) ->
    Services.Github.fetch_user req.params.login, res.generic_callback

  app.get '/github/repo/:login/:name', (req, res) ->
    repo_full_name = "#{req.params.login}/#{req.params.name}"
    Services.Github.fetch_repo repo_full_name, res.generic_callback

  app.get '/github/commits/:login/:name/:sha', (req, res) ->
    repo_full_name = "#{req.params.login}/#{req.params.name}"
    Services.Github.fetch_commit repo_full_name, req.params.sha, res.generic_callback

  app.get '/github/commits/:login/:name', (req, res) ->
    repo_full_name = "#{req.params.login}/#{req.params.name}"
    Services.Github.fetch_commits repo_full_name, res.generic_callback

  app.get '/twitter/timeline', (req, res) ->
    Services.Twitter.fetch_timeline res.generic_callback

  app.get '/', (req, res) ->
    res.sendfile 'views/index.html'