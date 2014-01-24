var Visit, logger, mongo;

mongo = require('../drivers/mongo');

Visit = mongo.model('visit');

logger = require('../lib/logger');

module.exports = function(req, res, next) {
  var visit;
  if (req.path.match(/^\/webhooks/)) {
    logger("Skipping webhook request: " + (req.path.replace('/webhooks/', '')));
    return next();
  } else {
    visit = new Visit;
    return visit.createFromRequest(req, res, next);
  }
};
