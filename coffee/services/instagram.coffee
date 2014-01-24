Service = require './base'
mongoose = require 'mongoose'
instagram = require '../lib/instagram'
_ = require '../lib/_'
async = require 'async'
logger = require '../lib/logger'

Models =
  activity: mongoose.model 'activity'

class Instagram extends Service

  fetch_recent_activity: (callback) ->
    async.parallel
      likes: @fetch_recent_likes
      images: @fetch_images
    , callback

  fetch_recent_likes: (callback) ->
    instagram.users.liked_by_self
      complete: (data) ->
        callback null, data

  fetch_images: (callback) ->
    current_pagination = {}
    images = []

    async.doWhilst (done) ->
      logger "Fetching Instagram activity", current_pagination
      instagram.users.recent
        user_id: 11843229
        max_id: if current_pagination.next_max_id? then current_pagination.next_max_id else null
        complete: (data, pagination) ->
          current_pagination = pagination
          async.each data, (image, next) ->
            logger "Processing image #{image.id}"
            images.push image

            Models.activity.findOneAndUpdate
              'service': 'instagram'
              'params.id': image.id
            ,
              $set:
                created_on: parseInt image.created_time * 1000
                service: 'instagram'
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