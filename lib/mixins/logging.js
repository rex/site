var logger;

logger = require('../logger');

module.exports = function(_) {
  _.mixin({
    log: function() {
      return logger.apply(logger, arguments);
    }
  });
  return _;
};
