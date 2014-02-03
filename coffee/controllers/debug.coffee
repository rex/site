logger = require '../lib/logger'
_ = require '../lib/_'
config = require '../config'
mongo = require '../drivers/mongo'
Redis = require '../drivers/redis'

Services =
  Github: require '../services/github'
  Instagram: require '../services/instagram'
  Twitter: require '../services/twitter'
  iTunes: require '../services/itunes'

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

  app.get '/services/instagram', (req, res) ->
    entity = req.query.entity
    I = Services.Instagram

    switch entity
      when "user" then I.fetch_user req.query.user_id, res.generic_callback
      when "feed" then I.fetch_user_feed res.generic_callback
      when "user_media" then I.fetch_media_by_user req.query.user_id, res.generic_callback
      when "user_likes" then I.fetch_likes_by_user res.generic_callback
      when "user_follows" then I.fetch_follows_by_user req.query.user_id, res.generic_callback
      when "user_followers" then I.fetch_followers_by_user req.query.user_id, res.generic_callback
      when "user_follower_requests" then I.fetch_follow_requests_by_user req.query.user_id, res.generic_callback
      when "media" then I.fetch_media req.query.media_id, res.generic_callback
      when "media_comments" then I.fetch_comments_by_media req.query.media_id, res.generic_callback
      when "media_likes" then I.fetch_likes_by_media req.query.media_id, res.generic_callback
      else res.send 500, "No valid entity specified"

  app.get '/services/itunes', (req, res) ->
    entity = req.query.entity
    I = Services.iTunes

    switch entity
      when "artist" then I.fetch_artist req.query.artist_id, res.generic_callback
      when "artist_albums" then I.fetch_albums_by_artist req.query.artist_id, res.generic_callback
      when "album_tracks" then I.fetch_tracks_by_album req.query.album_upc, res.generic_callback
      else res.send 500, "No valid entity specified"

  app.get '/services/twitter', (req, res) ->
    entity = req.query.entity
    T = Services.Twitter

    switch entity
      when "timeline" then T.fetch_timeline res.generic_callback
      when "following" then T.fetch_following res.generic_callback
      when "followers" then T.fetch_followers res.generic_callback
      when "mentions" then T.fetch_mentions res.generic_callback
      when "retweets" then T.fetch_retweets res.generic_callback
      when "blocks" then T.fetch_blocks res.generic_callback
      when "settings" then T.fetch_settings res.generic_callback
      when "favorites" then T.fetch_favorites res.generic_callback
      when "lists" then T.fetch_lists res.generic_callback
      when "list_memberships" then T.fetch_list_memberships res.generic_callback
      when "media" then T.fetch_media res.generic_callback
      else res.send 500, "No valid entity specified"

  app.get '/', (req, res) ->
    res.sendfile 'views/index.html'