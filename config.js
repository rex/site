var mongo, vcap_application, vcap_services;

vcap_services = process.env.VCAP_SERVICES != null ? JSON.parse(process.env.VCAP_SERVICES) : {};

vcap_application = process.env.VCAP_APPLICATION ? JSON.parse(process.env.VCAP_APPLICATION) : {};

mongo = {
  host: 'localhost',
  port: 27017,
  username: '',
  password: '',
  db: 'db'
};

mongo.url = "mongodb://" + mongo.host + ":" + mongo.port + "/" + mongo.db;

module.exports = {
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
  mongo: {
    host: mongo.host,
    port: mongo.port,
    user: mongo.username,
    pass: mongo.password,
    url: mongo.url
  }
};
