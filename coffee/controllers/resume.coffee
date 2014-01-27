mongo = require "#{process.cwd()}/drivers/mongo"

Models =
  Job: mongo.model 'job'

module.exports = (app) ->
  app.get '/resume', (req, res) ->
    Models.Job.find {}, (err, jobs) ->
      res.render 'resume/index',
        jobs: jobs