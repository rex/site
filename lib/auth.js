var express;

express = require('express');

module.exports = express.basicAuth(function(user, pass, callback) {
  var result;
  if (callback == null) {
    callback = function() {};
  }
  result = user === process.env.AUTH_USERNAME && pass === process.env.AUTH_PASSWORD;
  return callback(null, result);
});
