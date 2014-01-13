module.exports = (app) ->
  app.get '/bookmarks', (req, res) ->
    res.render 'bookmarks/index',
      env: process.env