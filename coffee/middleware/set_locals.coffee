_ = require '../lib/_'

module.exports = (req, res, next) ->
  req.isPJAX = if req.headers['X-PJAX']? then true else false
  res.locals.req =
    xhr: req.xhr
    path: req.originalUrl
    isPJAX: req.isPJAX
  res.locals._ = _
  res.locals.me = "Pierce"

  next()