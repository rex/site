Service = require './base'
mongo = require '../drivers/mongo'
_ = require '../lib/_'
async = require 'async'
logger = require '../lib/logger'
config = require '../config'

# Shortcuts, because lazy
UID = config.instagram.user_id

Models =
  activity: mongo.model 'activity'

class Instagram extends Service

  constructor: ->
    @api_config =
      client_id: process.env.INSTAGRAM_CLIENT_ID
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET
      access_token: process.env.INSTAGRAM_ACCESS_TOKEN
      user_id: process.env.INSTAGRAM_USER_ID

    @client = require 'instagram-node-lib'

    @client.set 'client_id', @api_config.client_id
    @client.set 'client_secret', @api_config.client_secret
    @client.set 'access_token', @api_config.access_token

  fetch_recent_activity: (callback) ->
    async.parallel
      likes: @fetch_recent_likes
      images: @fetch_images
    , callback

  fetch_recent_likes: (callback) ->
    @client.users.liked_by_self
      complete: (data) ->
        callback null, data

  fetch_images: (callback) ->
    current_pagination = {}
    images = []

    async.doWhilst (done) ->
      logger "Fetching Instagram activity", current_pagination
      @client.users.recent
        user_id: UID
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

  fetch_user: (user_id = UID, callback = ->) ->
    @client.users.info
      user_id: user_id
      complete: (data, pagination) ->
        callback null, data

  fetch_user_feed: (callback = ->) ->
    @client.users.self
      complete: (data, pagination) ->
        callback null, data

  fetch_media_by_user: (user_id = UID, callback = ->) ->
    @client.users.recent
      user_id: user_id
      complete: (data, pagination) ->
        callback null, data

  fetch_likes_by_user: (callback = ->) ->
    @client.users.liked_by_self
      complete: (data, pagination) ->
        callback null, data

  fetch_follows_by_user: (user_id = UID, callback = ->) ->
    @client.users.follows
      user_id: user_id
      complete: (data, pagination) ->
        callback null, data

  fetch_followers_by_user: (user_id = UID, callback = ->) ->
    @client.users.followed_by
      user_id: user_id
      complete: (data, pagination) ->
        callback null, data

  fetch_follow_requests_by_user: (user_id = UID, callback = ->) ->
    @client.users.requested_by
      user_id: user_id
      complete: (data, pagination) ->
        callback null, data

  fetch_media: (media_id, callback = ->) ->
    unless media_id then return callback "media_id required!"
    @client.media.info
      media_id: media_id
      complete: (data, pagination) ->
        callback null, data

  fetch_comments_by_media: (media_id, callback = ->) ->
    unless media_id then return callback "media_id required!"
    @client.media.comments
      media_id: media_id
      complete: (data, pagination) ->
        callback null, data

  fetch_likes_by_media: (media_id, callback = ->) ->
    unless media_id then return callback "media_id required!"
    @client.media.likes
      media_id: media_id
      complete: (data, pagination) ->
        callback null, data

  process_webhook_activity: (body, callback) ->


module.exports = new Instagram