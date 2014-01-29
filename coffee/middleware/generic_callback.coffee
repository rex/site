module.exports = (req, res, next) ->
  res.generic_callback = (err, body) ->
    if err
      res.send 500, err
    else
      res.json body

  next()