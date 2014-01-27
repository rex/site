instagram_lib = require 'instagram-node-lib'
async = require 'async'
mongo = require '../drivers/mongo'
logger = require '../lib/logger'
API = require './base'

Models =
  activity: mongo.model 'activity'

class Instagram extends API

  constructor: ->
    @config =
      client_id: process.env.INSTAGRAM_CLIENT_ID
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET
      access_token: process.env.INSTAGRAM_ACCESS_TOKEN
      user_id: process.env.INSTAGRAM_USER_ID

    @client = instagram_lib
    @client.set 'client_id', @config.client_id
    @client.set 'client_secret', @config.client_secret
    @client.set 'access_token', @config.access_token

  recent_images: (callback) ->

  all_images: (callback) ->

  recent_likes: (callback) ->

  all_likes: (callback) ->

module.exports = new Instagram