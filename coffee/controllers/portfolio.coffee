module.exports = (app) ->
  app.get '/portfolio', (req, res) ->
    res.render 'portfolio/index',
      env: process.env