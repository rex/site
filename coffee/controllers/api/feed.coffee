Mongo = require '../../drivers/mongo'
Redis = require '../../drivers/redis'
_ = require '../../lib/_'
logger = require '../../lib/logger'
async = require 'async'

Models =
  Activity: Mongo.model 'activity'

module.exports = (app) ->

  app.get '/feed', (req, res) ->
    skip = 0
    if _.isNumber(parseInt(req.query.page)) and req.query.page > 1
      skip = (req.query.page - 1) * 20

    Models.Activity
      .find()
      .sort( created_on: 'desc' )
      .skip(skip)
      .limit(20)
      .exec (err, activities) ->
        async.map activities, (activity, done) ->
          Redis.get_model activity.redis_key, (error, data) ->
            data = _.extend data,
              redis_key: activity.redis_key
            done error, data
        , (err, formatted) ->
          res.json
            err: err
            activities: formatted