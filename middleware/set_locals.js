var _;

_ = require('../lib/_');

module.exports = function(req, res, next) {
  req.isPJAX = req.headers['X-PJAX'] != null ? true : false;
  res.locals.req = {
    xhr: req.xhr,
    path: req.originalUrl,
    isPJAX: req.isPJAX
  };
  res.locals._ = _;
  res.locals.me = "Pierce";
  return next();
};
