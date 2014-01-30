twit = require 'twit'
config = require '../config'
Service = require './base'

class Twitter extends Service

  initialize: (done) ->
    @client = new twit config.twitter

  fetch_recent_activity: (callback = ->) ->

  fetch_timeline: (callback = ->) ->
    @client.get 'statuses/user_timeline', {}, callback

  fetch_followers: (callback = ->) ->
    @client.get 'followers', {}, callback


module.exports = new Twitter