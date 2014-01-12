request = require 'request'
_ = require './_'
logger = require './logger'

keys =
  id: process.env.GITHUB_CLIENT_ID
  secret: process.env.GITHUB_CLIENT_SECRET

fire = (params, callback) ->
  config = _.extend
    headers:
      'User-Agent': 'prex-site'
  , params
  config.url = "https://api.github.com#{config.url}"

  request config, (err, resp, body) ->
    if err then callback(err, null)
    else callback(err, JSON.parse body)

module.exports =
  events: (callback) ->
    fire { url: '/users/rex/events' }, callback
  repos: (callback) ->
    fire { url: '/users/rex/repos' }, callback