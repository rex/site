module.exports = (app) ->
  app.get '/admin', (req, res) ->
    res.render 'admin/index',
      env: process.env