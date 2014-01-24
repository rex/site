var app_config;

app_config = {
  debug: false,
  app: {
    host: 'localhost',
    port: 3000
  },
  redis: {
    port: 6379,
    host: '127.0.0.1',
    params: {}
  },
  instagram: {
    client_id: process.env.INSTAGRAM_CLIENT,
    client_secret: process.env.INSTAGRAM_SECRET,
    oauth_redirect_uri: process.env.INSTAGRAM_REDIRECT_URI
  },
  github: {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    access_token: process.env.GITHUB_ACCESS_TOKEN
  },
  evernote: {
    key: process.env.EVERNOTE_KEY,
    secret: process.env.EVERNOTE_SECRET
  },
  soundcloud: {
    client_id: process.env.SOUNDCLOUD_CLIENT_ID,
    client_secret: process.env.SOUNDCLOUD_CLIENT_SECRET
  },
  lastfm: {
    api_key: process.env.LASTFM_API_KEY,
    api_secret: process.env.LASTFM_API_SECRET
  },
  linkedin: {
    api_key: process.env.LINKEDIN_API_KEY,
    secret_key: process.env.LINKEDIN_SECRET_KEY,
    oauth_token: process.env.LINKEDIN_OAUTH_TOKEN,
    oauth_secret: process.env.LINKEDIN_OAUTH_SECRET
  },
  twilio: {
    sid: process.env.TWILIO_SID,
    token: process.env.TWILIO_TOKEN
  },
  mongo: {
    host: 'localhost',
    port: 27017,
    username: '',
    password: '',
    db: 'prex-site'
  }
};

module.exports = app_config;

module.exports.get_mongo_url = function() {
  var auth_string;
  if (app_config.mongo.username && app_config.mongo.password) {
    auth_string = "" + app_config.mongo.username + ":" + app_config.mongo.password + "@";
  } else {
    auth_string = "";
  }
  return "mongodb://" + auth_string + app_config.mongo.host + ":" + app_config.mongo.port + "/" + app_config.mongo.db;
};
