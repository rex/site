var logger, _;

_ = require('../lib/_');

logger = require('../lib/logger');

module.exports = function(req, res, next) {
  if (req.query.length) {
    logger("Query string params:", req.query);
  }
  if (_.has(req.query, 'json')) {
    logger("JSON response requested for URL: " + req.originalUrl);
    req.json_requested = true;
  }
  return next();
};
