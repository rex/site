mongoose = require 'mongoose'
Visit = mongoose.model 'visit'

module.exports = (app) ->
  app.get '/visits*', (req, res) ->
    Visit
      .find()
      .sort
        timestamp: -1
      .exec (err, recent_visits) ->
        res.json
          err: err
          visits: recent_visits