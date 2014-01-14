var mongo, mongo_instance, vcap_application, vcap_services;

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

if (process.env.VCAP_SERVICES) {
  mongo_instance = vcap_services['mongodb2-2.4.8'][0].credentials;
} else {
  mongo_instance = mongo;
}

module.exports = {
  instagram: {
    client_id: process.env.INSTAGRAM_CLIENT,
    client_secret: process.env.INSTAGRAM_SECRET
  },
  github: {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    access_token: process.env.GITHUB_ACCESS_TOKEN
  },
  mongo: {
    host: mongo_instance.host,
    port: mongo_instance.port,
    user: mongo_instance.username,
    pass: mongo_instance.password,
    url: mongo_instance.url
  }
};
