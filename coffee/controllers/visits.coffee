mongo = require "#{process.cwd()}/drivers/mongo"

Models =
  Visit: mongo.model 'visit'

module.exports = (app) ->
  app.get '/visits*', (req, res) ->
    Models.Visit
      .find()
      .sort
        timestamp: -1
      .exec (err, recent_visits) ->
        res.render 'visits/index',
          visits: recent_visits