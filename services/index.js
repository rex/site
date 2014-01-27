var Services, async, logger;

async = require('async');

logger = require('../lib/logger');

Services = {
  GitHub: require('./github'),
  Instagram: require('./instagram'),
  LastFM: require('./lastfm'),
  LinkedIn: require('./linkedin'),
  SoundCloud: require('./soundcloud'),
  Evernote: require('./evernote')
};

exports.initialize = function(services_initialized) {
  if (services_initialized == null) {
    services_initialized = function() {};
  }
  return async.series({
    GitHub: function(done) {
      return Services.GitHub.initialize(done);
    },
    Instagram: function(done) {
      return Services.Instagram.initialize(done);
    },
    LastFM: function(done) {
      return Services.LastFM.initialize(done);
    }
  }, function(err, results) {
    return services_initialized(err);
  });
};
