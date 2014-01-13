module.exports = (app) ->
  app.get '/tools', (req, res) ->
    res.render 'tools/index',
      env: process.env