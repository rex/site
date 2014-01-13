module.exports = (app) ->
  app.get '/resume', (req, res) ->
    res.render 'resume/index',
      env: process.env