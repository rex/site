var _;

_ = require('../lib/_');

module.exports = function(req, res, next) {
  if (req.query.debug_session === 'json') {
    return res.json(req.session);
  } else if (_.has(req.query, 'debug_session')) {
    console.log("Loaded session:", req.session);
  }
  return next();
};
