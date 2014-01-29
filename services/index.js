var Services, async, logger;

async = require('async');

logger = require('../lib/logger');

Services = {
  Evernote: require('./evernote'),
  GitHub: require('./github'),
  Instagram: require('./instagram'),
  LastFM: require('./lastfm'),
  LinkedIn: require('./linkedin'),
  SoundCloud: require('./soundcloud'),
  Twitter: require('./twitter')
};

exports.initialize = function(services_initialized) {
  if (services_initialized == null) {
    services_initialized = function() {};
  }
  return async.series({
    Evernote: function(done) {
      return Services.Evernote.initialize(done);
    },
    GitHub: function(done) {
      return Services.GitHub.initialize(done);
    },
    Instagram: function(done) {
      return Services.Instagram.initialize(done);
    },
    LastFM: function(done) {
      return Services.LastFM.initialize(done);
    },
    LinkedIn: function(done) {
      return Services.LinkedIn.initialize(done);
    },
    SoundCloud: function(done) {
      return Services.SoundCloud.initialize(done);
    },
    Twitter: function(done) {
      Services.Twitter.initialize(done);
      return done();
    }
  }, function(err, results) {
    return services_initialized(err);
  });
};
