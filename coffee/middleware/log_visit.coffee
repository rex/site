mongo = require '../drivers/mongo'
Visit = mongo.model 'visit'
logger = require '../lib/logger'

module.exports = (req, res, next) ->
  # if the requested route is a webhook, avoid it. Otherwise, we log the visit
  if req.path.match /^\/webhooks/
    logger "Skipping webhook request: #{req.path.replace '/webhooks/', ''}"
    next()
  else
    visit = new Visit
    visit.createFromRequest req, res, next