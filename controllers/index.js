var logger;

logger = require('../lib/logger');

module.exports = function(app) {
  return app.get('/', function(req, res) {
    return res.render('index', {
      uri: req.originalUrl,
      time: new Date().toLocaleString(),
      pretty: true
    });
  });
};
