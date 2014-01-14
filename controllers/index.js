var config, github, instagram, logger;

logger = require('../lib/logger');

instagram = require('../lib/instagram');

github = require('../lib/github');

config = require('../config');

module.exports = function(app) {
  require('./webhooks')(app);
  require('./admin')(app);
  require('./blog')(app);
  require('./bookmarks')(app);
  require('./code')(app);
  require('./portfolio')(app);
  require('./resume')(app);
  require('./tools')(app);
  require('./visits')(app);
  app.get('/instagram', function(req, res) {
    return instagram.users.info({
      user_id: 11843229,
      complete: function(data, pagination) {
        return res.json({
          data: data,
          pagination: pagination
        });
      }
    });
  });
  app.get('/env', function(req, res) {
    return res.json({
      config: config,
      env: process.env
    });
  });
  app.get('/github', function(req, res) {
    return github.repos(function(err, body) {
      return res.json({
        err: err,
        body: body
      });
    });
  });
  return app.get('/', function(req, res) {
    return github.events(function(err, body) {
      return res.render('index', {
        uri: req.originalUrl,
        time: new Date().toLocaleString(),
        pretty: true,
        feed: body
      });
    });
  });
};
