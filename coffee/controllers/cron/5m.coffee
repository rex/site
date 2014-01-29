logger = require '../../lib/logger'
async = require 'async'

Services =
  Github: require '../../services/github'

module.exports = ->
  logger "Cron running: 5m"

  async.parallel
    github_activity: (done) ->
      Services.Github.fetch_recent_activity done
  , (err, results) ->
    if err
      logger.error err
    else
      logger "5m cron complete!" #, results