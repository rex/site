var config, logger, mongoose, schemas, _;

mongoose = require('mongoose');

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
  var conn;
  logger("Initializing models...");
  mongoose.model('env', schemas.env);
  mongoose.model('post', schemas.post);
  mongoose.model('job', schemas.job);
  mongoose.model('snippet', schemas.snippet);
  mongoose.model('tag', schemas.tag);
  mongoose.model('link', schemas.link);
  mongoose.model('activity', schemas.activity, 'activities');
  mongoose.model('visit', schemas.visit);
  mongoose.model('github_repo', schemas.github.repo);
  mongoose.model('github_commit', schemas.github.commit);
  mongoose.model('oauth_token', schemas.oauth_token);
  conn = mongoose.connection;
  logger("Initializing Mongoose event listeners...");
  conn.on('connecting', function() {
    return logger('Mongoose connecting...');
  });
  conn.on('connected', function() {
    return logger('Mongoose connected...');
  });
  conn.once('open', function() {
    logger('Mongoose connection open...');
    logger("Loaded " + (mongoose.modelNames().length) + " models:");
    _.each(mongoose.modelNames(), function(name) {
      return logger(" > " + name);
    });
    if (typeof after_connected === 'function') {
      return after_connected();
    }
  });
  conn.on('disconnecting', function() {
    return logger.warn('Mongoose disconnecting...');
  });
  conn.on('disconnected', function() {
    return logger.warn('Mongoose disconnected...');
  });
  conn.on('close', function() {
    return logger.warn('Closing Mongoose connection...');
  });
  conn.on('reconnected', function() {
    return logger('Mongoose reconnected...');
  });
  conn.on('error', function() {
    return logger.error('Mongoose connection error!');
  });
  conn.on('fullsetup', function() {
    return logger('All replica set nodes set up...');
  });
  logger("Connecting to MongoDB...");
  return mongoose.connect(config.mongo.url, {}, function() {
    return logger("Mongoose connected?", arguments);
  });
};
