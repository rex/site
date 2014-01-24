var mongo, queue;

queue = require('../drivers/queue');

mongo = require('../drivers/mongo');

exports.initialize = function(workers_initialized) {
  if (workers_initialized == null) {
    workers_initialized = function() {};
  }
  return workers_initialized();
};
