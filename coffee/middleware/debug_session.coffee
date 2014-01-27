_ = require '../lib/_'

module.exports = (req, res, next) ->
  if req.query.debug_session is 'json'
    return res.json req.session
  else if _.has req.query, 'debug_session'
    console.log "Loaded session:", req.session

  next()