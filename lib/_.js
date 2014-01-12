var logger, _;

logger = require('./logger');

_ = require('underscore');

_.mixin({
  log: function() {
    return logger.apply(logger, arguments);
  }
});

module.exports = _;
