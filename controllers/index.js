var Step, config, glob, logger, path, _;

logger = require('../lib/logger');

_ = require('../lib/_');

Step = require('../lib/step');

config = require('../config');

glob = require('glob');

path = require('path');

exports.initialize = function(app, initialized) {
  if (initialized == null) {
    initialized = function() {};
  }
  Step.group("Load Controllers");
  return glob('./controllers/**/*.js', function(err, files) {
    var controllers, cronfiles;
    if (err) {
      return console.error("Glob error", err);
    }
    cronfiles = /\/cron\//;
    controllers = /\.\/controllers\//;
    _.each(files, function(file) {
      var controller;
      if (file.match(cronfiles)) {
        config.debug && logger("Skipping: " + file);
        return;
      }
      controller = require(path.resolve(file));
      if (!_.isFunction(controller)) {
        return;
      }
      Step.start("Loading controller " + (file.replace(controllers, '')));
      controller(app);
      return Step.complete();
    });
    Step.groupEnd();
    return initialized();
  });
};
