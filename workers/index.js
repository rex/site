var Workers, mongo, queue;

queue = require('../drivers/queue');

mongo = require('../drivers/mongo');

Workers = {
  Services: {
    LastFM: require('./services/lastfm')
  }
};

exports.initialize = function(workers_initialized) {
  if (workers_initialized == null) {
    workers_initialized = function() {};
  }
  /*
  Initialize Service Workers
  */

  require('./services/lastfm').initialize();
  return workers_initialized();
};
