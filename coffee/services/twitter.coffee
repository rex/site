twit = require 'twit'
config = require '../config'
Service = require './base'

class Twitter extends Service

  initialize: (done) ->
    @client = new twit config.twitter

  fetch_recent_activity: (callback = ->) ->

  fetch_timeline: (callback = ->) ->
    @client.get 'statuses/user_timeline', {}, callback

  fetch_following: (callback = ->) ->
    @client.get 'friends/list', {}, callback

  fetch_followers: (callback = ->) ->
    @client.get 'followers/list', {}, callback

  fetch_mentions: (callback = ->) ->
    @client.get 'statuses/mentions_timeline', {}, callback

  fetch_retweets: (callback = ->) ->
    @client.get 'statuses/retweets_of_me', {}, callback

  fetch_blocks: (callback = ->) ->
    @client.get 'blocks/list', {}, callback

  fetch_settings: (callback = ->) ->
    @client.get 'account/settings', {}, callback

  fetch_favorites: (callback = ->) ->
    @client.get 'favorites/list', {}, callback

  fetch_lists: (callback = ->) ->
    @client.get 'lists/list', {}, callback

  fetch_list_memberships: (callback = ->) ->
    @client.get 'lists/memberships', {}, callback

  fetch_media: (callback = ->) ->
    @client.get 'search/tweets', { q: 'from:kiapierce filter:links' }, callback


module.exports = new Twitter