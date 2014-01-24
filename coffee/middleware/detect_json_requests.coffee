_ = require '../lib/_'
logger = require '../lib/logger'

module.exports = (req, res, next) ->
  if req.query
    logger "Query string params:", req.query

  if _.has req.query, 'json'
    logger "JSON response requested for URL: #{req.originalUrl}"
    req.json_requested = true

  next()