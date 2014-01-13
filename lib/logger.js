var winston;

winston = require('winston');

winston.cli();

module.exports = function() {
  return winston.info.apply(winston.info, arguments);
};

module.exports.info = function() {
  return winston.info.apply(winston.info, arguments);
};

module.exports.debug = function() {
  return winston.info.apply(winston.info, arguments);
};

module.exports.warn = function() {
  return winston.warn.apply(winston.warn, arguments);
};

module.exports.error = function() {
  return winston.error.apply(winston.error, arguments);
};
