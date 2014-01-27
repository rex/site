Service = require './base'
mongo = require '../drivers/mongo'
_ = require '../lib/_'
async = require 'async'
logger = require '../lib/logger'
Instagram_API = require '../apis/instagram'

Models =
  activity: mongo.model 'activity'

class Instagram extends Service

  fetch_recent_activity: (callback) ->
    async.parallel
      likes: @fetch_recent_likes
      images: @fetch_images
    , callback

  fetch_recent_likes: (callback) ->
    Instagram_API.users.liked_by_self
      complete: (data) ->
        callback null, data

  fetch_images: (callback) ->
    current_pagination = {}
    images = []

    async.doWhilst (done) ->
      logger "Fetching Instagram activity", current_pagination
      Instagram_API.users.recent
        user_id: 11843229
        max_id: if current_pagination.next_max_id? then current_pagination.next_max_id else null
        complete: (data, pagination) ->
          current_pagination = pagination
          async.each data, (image, next) ->
            logger "Processing image #{image.id}"
            images.push image

            Models.activity.findOneAndUpdate
              'service': 'Instagram_API'
              'params.id': image.id
            ,
              $set:
                created_on: parseInt image.created_time * 1000
                service: 'Instagram_API'
                type: 'share'
                params: image
            , { upsert: true }, next
          , done
    , ->
      logger "Checking pagination: ", current_pagination
      _.has current_pagination, "next_url"
    , callback


  process_webhook_activity: (body, callback) ->


module.exports = new Instagram