mongoose = require 'mongoose'
Jobs = mongoose.model 'job'

module.exports = (app) ->
  app.get '/resume', (req, res) ->
    Jobs.find {}, (err, jobs) ->
      res.render 'resume/index',
        jobs: jobs