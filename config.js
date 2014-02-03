var app_config;

app_config = {
  debug: false,
  colors: {
    white: '\033[0;m',
    gold: '\033[1;m',
    red: '\033[0;31m',
    orange: '\033[1;31m',
    teal: '\033[0;32m',
    green: '\033[1;32m',
    tan: '\033[0;33m',
    yellow: '\033[1;33m',
    brown: '\033[0;34m',
    blue: '\033[1;34m',
    darktan: '\033[0;35m',
    pink: '\033[1;35m',
    cyan: '\033[0;36m',
    reset: '\033[0;39m'
  }
};

module.exports = app_config;

module.exports.load_app_config = function(app_config_loaded) {
  if (app_config_loaded == null) {
    app_config_loaded = function() {};
  }
  app_config.app = {
    host: process.env.PREX_APP_HOST,
    port: process.env.PREX_APP_PORT
  };
  app_config.redis = {
    port: process.env.PREX_REDIS_PORT,
    host: process.env.PREX_REDIS_HOST,
    params: process.env.PREX_REDIS_PARAMS,
    username: process.env.PREX_REDIS_USERNAME,
    password: process.env.PREX_REDIS_PASSWORD
  };
  app_config.mongo = {
    host: process.env.PREX_MONGO_HOST,
    port: process.env.PREX_MONGO_PORT,
    username: process.env.PREX_MONGO_USERNAME,
    password: process.env.PREX_MONGO_PASSWORD,
    db: process.env.PREX_MONGO_DB
  };
  app_config.instagram = {
    client_id: process.env.INSTAGRAM_CLIENT,
    client_secret: process.env.INSTAGRAM_SECRET,
    access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
    oauth_redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
    user_id: process.env.INSTAGRAM_USER_ID
  };
  app_config.github = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    access_token: process.env.GITHUB_ACCESS_TOKEN,
    username: process.env.GITHUB_USERNAME
  };
  app_config.evernote = {
    key: process.env.EVERNOTE_KEY,
    secret: process.env.EVERNOTE_SECRET
  };
  app_config.soundcloud = {
    client_id: process.env.SOUNDCLOUD_CLIENT_ID,
    client_secret: process.env.SOUNDCLOUD_CLIENT_SECRET,
    redirect_uri: process.env.SOUNDCLOUD_REDIRECT_URI,
    access_token: process.env.SOUNDCLOUD_ACCESS_TOKEN,
    auth_code: process.env.SOUNDCLOUD_AUTH_CODE
  };
  app_config.lastfm = {
    api_key: process.env.LASTFM_API_KEY,
    api_secret: process.env.LASTFM_API_SECRET
  };
  app_config.linkedin = {
    api_key: process.env.LINKEDIN_API_KEY,
    secret_key: process.env.LINKEDIN_SECRET_KEY,
    oauth_token: process.env.LINKEDIN_OAUTH_TOKEN,
    oauth_secret: process.env.LINKEDIN_OAUTH_SECRET
  };
  app_config.facebook = {
    app_id: process.env.FACEBOOK_APP_ID,
    app_secret: process.env.FACEBOOK_APP_SECRET,
    client_token: process.env.FACEBOOK_CLIENT_TOKEN,
    access_token: process.env.FACEBOOK_ACCESS_TOKEN
  };
  app_config.twilio = {
    sid: process.env.TWILIO_SID,
    token: process.env.TWILIO_TOKEN
  };
  app_config.reddit = {
    id: process.env.REDDIT_ID,
    secret: process.env.REDDIT_SECRET,
    redirect_uri: process.env.REDDIT_REDIRECT_URI
  };
  app_config.twitter = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  };
  return app_config_loaded();
};

module.exports.get_mongo_url = function() {
  var auth_string;
  if (app_config.mongo.username && app_config.mongo.password) {
    auth_string = "" + app_config.mongo.username + ":" + app_config.mongo.password + "@";
  } else {
    auth_string = "";
  }
  return "mongodb://" + auth_string + app_config.mongo.host + ":" + app_config.mongo.port + "/" + app_config.mongo.db;
};
