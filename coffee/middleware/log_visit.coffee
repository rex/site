mongo = require '../drivers/mongo'
logger = require '../lib/logger'

Models =
  Visit: mongo.model 'visit'

module.exports = (req, res, next) ->
  # if the requested route is a webhook, avoid it. Otherwise, we log the visit
  if req.path.match /^\/webhooks/
    logger "Skipping webhook request: #{req.path.replace '/webhooks/', ''}"
    next()
  else
    visit = new Models.Visit
    visit.createFromRequest req, res, next