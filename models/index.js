var Step, config, logger, mongo, schemas, _;

mongo = require('../drivers/mongo');

config = require('../config');

logger = require('../lib/logger');

_ = require('../lib/_');

Step = require('../lib/step');

Step.group("Load Models");

schemas = {
  activity: require('./activity'),
  env: require('./env'),
  job: require('./job'),
  link: require('./link'),
  oauth_token: require('./oauth_token'),
  post: require('./post'),
  lastfm_scrobble: require('./services/lastfm/scrobble'),
  github_repo: require('./services/github/repo'),
  github_commit: require('./services/github/commit'),
  github_push: require('./services/github/push'),
  snippet: require('./snippet'),
  tag: require('./tag'),
  visit: require('./visit')
};

exports.initialize = function(after_connected) {
  if (after_connected == null) {
    after_connected = function() {};
  }
  _.each(schemas, function(model) {
    var doc, loaded_model;
    Step.start("Loading model: " + model.model_name);
    if (model.db_name) {
      mongo.model(model.model_name, model.schema, model.db_name);
    } else {
      mongo.model(model.model_name, model.schema);
    }
    loaded_model = mongo.model(model.model_name);
    doc = new loaded_model();
    if (doc.model_name === model.model_name) {
      return Step.complete();
    } else {
      return Step.fail("Model name not loaded: " + model.model_name);
    }
  });
  console.log("Models loaded", mongo.loaded_models);
  Step.groupEnd();
  return mongo.initialize(after_connected);
};
