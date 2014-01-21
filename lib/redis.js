var client, config, logger, redis;

config = require('../config');

redis = require('redis');

logger = require('./logger');

client = redis.createClient(config.redis.port, config.redis.host, config.redis.params);

client.on('connect', function() {
  return logger('Redis is connected');
});

client.on('ready', function() {
  return logger('Redis ready for commands');
});

client.on('error', function() {
  return logger.error('Redis connection failure');
});

client.on('end', function() {
  return logger.warn('Redis connection closed');
});

client.on('drain', function() {
  return logger('Redis command queue drained');
});

client.on('idle', function() {
  return logger('Redis connection idle');
});

module.exports = client;
