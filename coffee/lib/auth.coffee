express = require 'express'

module.exports = express.basicAuth (user, pass, callback = ->) ->
  result = user is process.env.AUTH_USERNAME and pass is process.env.AUTH_PASSWORD
  callback null, result

