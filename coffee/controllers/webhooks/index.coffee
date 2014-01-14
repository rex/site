module.exports = (app) ->
  require('./github') app
  require('./twitter') app
  require('./instagram') app