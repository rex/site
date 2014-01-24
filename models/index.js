var config, logger, mongo, schemas, _;

mongo = require('../drivers/mongo');

config = require('../config');

logger = require('../lib/logger');

_ = require('../lib/_');

schemas = {
  env: require('./env'),
  post: require('./post'),
  job: require('./job'),
  snippet: require('./snippet'),
  tag: require('./tag'),
  link: require('./link'),
  activity: require('./activity'),
  visit: require('./visit'),
  oauth_token: require('./oauth_token'),
  github: {
    repo: require('./github/repo'),
    commit: require('./github/commit')
  }
};

exports.initialize = function(after_connected) {
  if (after_connected == null) {
    after_connected = function() {};
  }
  mongo.model('env', schemas.env);
  mongo.model('post', schemas.post);
  mongo.model('job', schemas.job);
  mongo.model('snippet', schemas.snippet);
  mongo.model('tag', schemas.tag);
  mongo.model('link', schemas.link);
  mongo.model('activity', schemas.activity, 'activities');
  mongo.model('visit', schemas.visit);
  mongo.model('github_repo', schemas.github.repo);
  mongo.model('github_commit', schemas.github.commit);
  mongo.model('oauth_token', schemas.oauth_token);
  return mongo.initialize(after_connected);
};
