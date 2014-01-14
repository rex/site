module.exports = (app) ->
  app.get '/blog*', (req, res) ->
    res.render 'blog/index',
      env: process.env
      path: req.path