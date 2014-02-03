var config, env_path, fs, yaml, _;

yaml = require('js-yaml');

fs = require('fs');

_ = require('./_');

config = require('../config');

env_path = "" + (process.cwd()) + "/.env";

module.exports = function(env_loaded) {
  var env;
  if (env_loaded == null) {
    env_loaded = function() {};
  }
  env = yaml.safeLoad(fs.readFileSync(env_path, 'utf8'));
  _.each(env, function(section, name) {
    return _.each(section, function(subsection, prefix) {
      return _.each(subsection, function(val, key) {
        var env_key;
        env_key = ("" + prefix + "_" + key).toUpperCase();
        return process.env[env_key] = val;
      });
    });
  });
  return config.load_app_config(env_loaded);
};
