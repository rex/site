logger = require './lib/logger'
_ = require './lib/_'
async = require 'async'
mongo = require './drivers/mongo'
Env = mongo.model 'env'
debug = require('./config').debug

module.exports = (after_env_vars_saved = ->) ->
  credentials =
    EVERNOTE_KEY: "piercemoore-6046"
    EVERNOTE_SECRET: "d88cdf7c1efb80ff"
    FACEBOOK_APP_ID: 258704167625509
    FACEBOOK_APP_SECRET: "52784173196c3d416d5db7ee4f716e13"
    FACEBOOK_CLIENT_TOKEN: "b588ea97f9c945546ba0699270628b4b"
    GITHUB_ACCESS_TOKEN: "e362a1fcb0db93b2db6b7150355b8b128e4c9164"
    GITHUB_USERNAME: 'rex'
    INSTAGRAM_CLIENT: "d8b2d8ec18a1429f92c8b5c489c07f22"
    INSTAGRAM_REDIRECT_URI: "http://www.prex.io/oauth/redirect/instagram"
    INSTAGRAM_SECRET: "6372a59094204e5cbe088796ee06b5c7"
    INSTAGRAM_USER_ID: 11843229
    LASTFM_API_KEY: "c2c91e39a8eaef5e093d3f3f55fba208"
    LASTFM_API_SECRET: "4d193b8c7b67785a1e78c010560af815"
    LASTFM_USERNAME: 'piercemoore'
    LINKEDIN_API_KEY: "75lq9j0oex54pk"
    LINKEDIN_OAUTH_SECRET: "2a7ded80-c7f7-4225-a0ab-6ff083357a7f"
    LINKEDIN_OAUTH_TOKEN: "c02c7571-a412-4428-ac24-89092b8bbe7d"
    LINKEDIN_SECRET_KEY: "faDnvRxIjIwpKHSj"
    SOUNDCLOUD_CLIENT_ID: "446c0b08cb4b0faf0120c6604f5c0965"
    SOUNDCLOUD_CLIENT_SECRET: "0f72c46b774c0b0b182980c3a968a212"
    TWILIO_SID: "ACee19bc5833976d2b1dfb8bdffa0fb597"
    TWILIO_TOKEN: "0d6f9aa10c91df766561ad01efed99fe"
    TWITTER_ACCESS_TOKEN: "63488595-GRlHweG6pQ5LnV7vTjj3DdurAmZ6voHseKn7VsNDz"
    TWITTER_ACCESS_TOKEN_SECRET: "hC9uEUmb1MfyzSQCBRiDwfyG8KfmzQEzg2UmJ7xA1bWm9"
    TWITTER_CONSUMER_KEY: "XZHP0LuiOhQbtw322kiA2Q"
    TWITTER_CONSUMER_SECRET: "AVl7ws30WzhHv6DJRke1vpmSYmVZaU6pks4fEgNcrrg"

  async.each _.keys(credentials), (key, next) ->
    Env.findOneAndUpdate { key: key },
      $set:
        key: key
        val: credentials[key]
    , { upsert: true }, (err, env_var) ->
      next err
  , (err) ->
    if debug
      if err then logger.error err else logger "Loaded #{Object.keys(credentials).length} credentials into database"

    after_env_vars_saved()