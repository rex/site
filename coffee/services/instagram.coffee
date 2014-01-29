Service = require './base'
mongo = require '../drivers/mongo'
_ = require '../lib/_'
async = require 'async'
logger = require '../lib/logger'
Instagram_API = require 'instagram-node-lib'

Models =
  activity: mongo.model 'activity'

class Instagram extends Service

  constructor: ->
    @api_config =
      client_id: process.env.INSTAGRAM_CLIENT_ID
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET
      access_token: process.env.INSTAGRAM_ACCESS_TOKEN
      user_id: process.env.INSTAGRAM_USER_ID

    Instagram_API.set 'client_id', @api_config.client_id
    Instagram_API.set 'client_secret', @api_config.client_secret
    Instagram_API.set 'access_token', @api_config.access_token

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

  fetch_user: (callback = ->) ->

  process_webhook_activity: (body, callback) ->


module.exports = new Instagram