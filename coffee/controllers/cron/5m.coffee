github = require '../../lib/github'
logger = require '../../lib/logger'
_ = require '../../lib/_'
mongoose = require 'mongoose'
async = require 'async'

Models =
  activity: mongoose.model 'activity'

module.exports = ->
  logger "Cron running: 5m"

  async.parallel

    # Retrieve latest github activity
    github_activity: (done) ->
      logger "Processing recent github activity..."
      github.events (err, body) ->
        if err then return done err
        activity_ids = _.pluck body, "id"
        logger "Checking activity IDs", activity_ids
        Models.activity.find
          service: "github"
          'params.id':
            '$in': activity_ids
        , (err, existing_activities) ->
          old_activities = _.map existing_activities, (old_activity) ->
            old_activity.params.id
          logger "Old activities found: ", old_activities
          new_activities = _.difference activity_ids, old_activities
          logger "New activities found", new_activities

          async.each new_activities, (activity_id, next) ->
            logger "Processing activity ##{activity_id}"
            activity = _.findWhere body,
              id: activity_id

            Activity = new Models.activity
              service: 'github'
              created_on: activity.created_at
              type: activity.type
              params: activity

            Activity.save next
          , (err) ->
            done err

  , (err, results) ->
    if err
      logger.error err
    else
      logger "5m cron complete!", results