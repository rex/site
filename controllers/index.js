var Models, config, github, instagram, logger, mongoose;

logger = require('../lib/logger');

instagram = require('../lib/instagram');

github = require('../lib/github');

config = require('../config');

mongoose = require('mongoose');

Models = {
  activity: mongoose.model('activity')
};

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
  require('./populate')(app);
  require('./cron')(app);
  app.get('/instagram', function(req, res) {
    return instagram.users.recent({
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
      env: process.env,
      vcap_services: process.env.VCAP_SERVICES != null ? JSON.parse(process.env.VCAP_SERVICES) : "Not running on AppFog",
      vcap_application: process.env.VCAP_APPLICATION != null ? JSON.parse(process.env.VCAP_APPLICATION) : "Not running on AppFog"
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
    return Models.activity.find().sort({
      created_on: 'desc'
    }).exec(function(err, body) {
      if (req.json_requested) {
        return res.json(body);
      } else {
        return res.render('index', {
          uri: req.originalUrl,
          time: new Date().toLocaleString(),
          pretty: true,
          feed: body
        });
      }
    });
  });
};
