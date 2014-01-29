var Step, config, glob, logger, mongo, path, _;

mongo = require('../drivers/mongo');

config = require('../config');

logger = require('../lib/logger');

_ = require('../lib/_');

Step = require('../lib/step');

glob = require('glob');

path = require('path');

exports.initialize = function(after_connected) {
  if (after_connected == null) {
    after_connected = function() {};
  }
  Step.group("Load Models");
  glob("./models/**/*.js", function(err, files) {
    if (err) {
      console.error("Glob error", err);
    }
    console.debug && console.log("Glob files", files);
    _.each(files, function(file) {
      var doc, loaded_model, model;
      model = require(path.resolve(file));
      if (!model.model_name) {
        return;
      }
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
    return Step.groupEnd();
  });
  return mongo.initialize(after_connected);
};
