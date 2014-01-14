mongoose = require 'mongoose'
Visit = mongoose.model 'visit'

module.exports = (app) ->
  app.get '/visits*', (req, res) ->
    Visit
      .find()
      .sort
        timestamp: -1
      .exec (err, recent_visits) ->
        res.render 'visits/index',
          visits: recent_visits