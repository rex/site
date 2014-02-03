Service = require './base'
mongo = require '../drivers/mongo'
_ = require '../lib/_'
async = require 'async'
logger = require '../lib/logger'

Models =
  activity: mongo.model 'activity'

class iTunes extends Service

  constructor: ->
    @api_base_url = "https://itunes.apple.com/lookup"
    @api_is_json = true

  fetch_recent_activity: (callback = ->) ->

  fetch_artist: (artist_id = null, callback = ->) ->
    @api_call { url: "?id=#{artist_id}" }, (err, body) ->
      if err then return callback err
      callback null, _.first body.results

  fetch_albums_by_artist: (artist_id = null, callback = ->) ->
    @api_call { url: "?id=#{artist_id}&entity=album" }, (err, body) ->
      if err then return callback err
      callback null, _.rest body.results

  fetch_tracks_by_album: (album_upc = null, callback = ->) ->
    @api_call { url: "?upc=#{album_upc}&entity=song" }, (err, body) ->
      if err then return callback err
      callback null, _.rest body.results

module.exports = new iTunes