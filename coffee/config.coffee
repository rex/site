app_config =
  debug: false

module.exports = app_config

module.exports.load_app_config = (app_config_loaded = ->) ->
  app_config.app =
    host: process.env.PREX_APP_HOST
    port: process.env.PREX_APP_PORT

  app_config.redis =
    port: process.env.PREX_REDIS_PORT
    host: process.env.PREX_REDIS_HOST
    params: process.env.PREX_REDIS_PARAMS
    username: process.env.PREX_REDIS_USERNAME
    password: process.env.PREX_REDIS_PASSWORD

  app_config.mongo =
    host: process.env.PREX_MONGO_HOST
    port: process.env.PREX_MONGO_PORT
    username: process.env.PREX_MONGO_USERNAME
    password: process.env.PREX_MONGO_PASSWORD
    db: process.env.PREX_MONGO_DB

  app_config_loaded()

module.exports.load_services = (credentials_loaded = ->) ->
  app_config.instagram =
    client_id: process.env.INSTAGRAM_CLIENT
    client_secret: process.env.INSTAGRAM_SECRET
    oauth_redirect_uri: process.env.INSTAGRAM_REDIRECT_URI

  app_config.github =
    client_id: process.env.GITHUB_CLIENT_ID
    client_secret: process.env.GITHUB_CLIENT_SECRET
    access_token: process.env.GITHUB_ACCESS_TOKEN

  app_config.evernote =
    key: process.env.EVERNOTE_KEY
    secret: process.env.EVERNOTE_SECRET

  app_config.soundcloud =
    client_id: process.env.SOUNDCLOUD_CLIENT_ID
    client_secret: process.env.SOUNDCLOUD_CLIENT_SECRET

  app_config.lastfm =
    api_key: process.env.LASTFM_API_KEY
    api_secret: process.env.LASTFM_API_SECRET

  app_config.linkedin =
    api_key: process.env.LINKEDIN_API_KEY
    secret_key: process.env.LINKEDIN_SECRET_KEY
    oauth_token: process.env.LINKEDIN_OAUTH_TOKEN
    oauth_secret: process.env.LINKEDIN_OAUTH_SECRET

  app_config.twilio =
    sid: process.env.TWILIO_SID
    token: process.env.TWILIO_TOKEN

  credentials_loaded()


module.exports.get_mongo_url = ->
  if app_config.mongo.username and app_config.mongo.password
    auth_string = "#{app_config.mongo.username}:#{app_config.mongo.password}@"
  else
    auth_string = ""

  "mongodb://#{auth_string}#{app_config.mongo.host}:#{app_config.mongo.port}/#{app_config.mongo.db}"