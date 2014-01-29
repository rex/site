config = require '../config'
API = require './base'

class Github extends API

  constructor: ->
    @config =
      headers:
        'User-Agent': 'prex.io'

    @base_url = 'https://api.github.com'
    @login = config.github.username

    @is_json = true

    @tokens =
      access_token: process.env.GITHUB_ACCESS_TOKEN
      client_id: process.env.GITHUB_CLIENT_ID
      client_secret: process.env.GITHUB_CLIENT_SECRET

  recent_events: (callback = ->) ->
    @fire { url: "/users/#{@login}/events" }, callback

  fetch_repo: (repo_full_name, callback = ->) ->
    @fire { url: "/repos/#{repo_full_name}" }, callback

  fetch_repos: (callback = ->) ->
    @fire { url: "/users/#{@login}/repos" }, callback

  fetch_gist: (gist_id, callback = ->) ->
    @fire { url: "/gists/#{gist_id}" }, callback

  fetch_gists: (callback = ->) ->
    @fire { url: "/users/#{@login}/gists" }, callback

  fetch_user: (login, callback = ->) ->
    @fire { url: "/users/#{login}" }, callback

  fetch_commit: (repo_full_name, commit_sha, callback = ->) ->
    @fire { url: "/repos/#{repo_full_name}/commits/#{commit_sha}" }, callback

  fetch_commits: (repo_full_name, callback = ->) ->
    @fire { url: "/repos/#{repo_full_name}/commits" }, callback

module.exports = new Github