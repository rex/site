logger = require '../../lib/logger'
async = require 'async'

Services =
  Github: require '../../services/github'
  Instagram: require '../../services/instagram'

module.exports = ->
  logger "Cron running: 1h"

  # Start our asynchronous/parallel cron functions
  async.parallel

    # Retrieve full list of github repos
    github_repos: (done) ->
      Services.Github.fetch_repos done

    instagram_images: (done) ->
      Services.Instagram.fetch_recent_activity done

  , (err, results) ->
    if err
      logger.error err
    else
      logger "Successfully completed 1h cron"