API = require './base'

class Github extends API

  constructor: ->
    @config =
      headers:
        'User-Agent': 'prex.io'

    @base_url = 'https://api.github.com'

    @is_json = true

    @tokens =
      access_token: process.env.GITHUB_ACCESS_TOKEN
      client_id: process.env.GITHUB_CLIENT_ID
      client_secret: process.env.GITHUB_CLIENT_SECRET

  recent_events: (callback) ->
    @fire { url: '/users/rex/events' }, callback

  fetch_repos: (callback) ->
    @fire { url: '/users/rex/repos' }, callback

module.exports = new Github