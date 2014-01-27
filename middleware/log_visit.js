var Models, logger, mongo;

mongo = require('../drivers/mongo');

logger = require('../lib/logger');

Models = {
  Visit: mongo.model('visit')
};

module.exports = function(req, res, next) {
  var visit;
  if (req.path.match(/^\/webhooks/)) {
    logger("Skipping webhook request: " + (req.path.replace('/webhooks/', '')));
    return next();
  } else {
    visit = new Models.Visit;
    return visit.createFromRequest(req, res, next);
  }
};
