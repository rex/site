module.exports = (app) ->
  app.get '/code', (req, res) ->
    res.render 'code/index', process.env