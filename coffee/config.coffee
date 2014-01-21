vcap_services = if process.env.VCAP_SERVICES? then JSON.parse process.env.VCAP_SERVICES else {}
vcap_application = if process.env.VCAP_APPLICATION then JSON.parse process.env.VCAP_APPLICATION else {}

mongo =
  host: 'localhost'
  port: 27017
  username: ''
  password: ''
  db: 'db'

mongo.url = "mongodb://#{mongo.host}:#{mongo.port}/#{mongo.db}"

if process.env.VCAP_SERVICES then mongo_instance = vcap_services['mongodb2-2.4.8'][0].credentials else mongo_instance = mongo

module.exports =
  instagram:
    client_id: process.env.INSTAGRAM_CLIENT
    client_secret: process.env.INSTAGRAM_SECRET
    oauth_redirect_uri: process.env.INSTAGRAM_REDIRECT_URI
  github:
    client_id: process.env.GITHUB_CLIENT_ID
    client_secret: process.env.GITHUB_CLIENT_SECRET
    access_token: process.env.GITHUB_ACCESS_TOKEN
  evernote:
    key: process.env.EVERNOTE_KEY
    secret: process.env.EVERNOTE_SECRET
  soundcloud:
    client_id: process.env.SOUNDCLOUD_CLIENT_ID
    client_secret: process.env.SOUNDCLOUD_CLIENT_SECRET
  lastfm:
    api_key: process.env.LASTFM_API_KEY
    api_secret: process.env.LASTFM_API_SECRET
  linkedin:
    api_key: process.env.LINKEDIN_API_KEY
    secret_key: process.env.LINKEDIN_SECRET_KEY
    oauth_token: process.env.LINKEDIN_OAUTH_TOKEN
    oauth_secret: process.env.LINKEDIN_OAUTH_SECRET
  mongo:
    host: mongo_instance.host
    port: mongo_instance.port
    user: mongo_instance.username
    pass: mongo_instance.password
    url: mongo_instance.url