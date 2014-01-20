var Models, Services, config, instagram, logger, mongoose;

logger = require('../lib/logger');

instagram = require('../lib/instagram');

config = require('../config');

mongoose = require('mongoose');

Services = {
  Github: require('../services/github'),
  Instagram: require('../services/instagram')
};

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
    return Services.Instagram.fetch_recent_activity(function(err, images) {
      if (err) {
        return res.send(500, err);
      } else {
        return res.json(images);
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
  app.get('/github/activity', function(req, res) {
    return Services.Github.fetch_recent_activity(function(err, activity) {
      if (err) {
        return res.send(500, err);
      } else {
        return res.json(activity);
      }
    });
  });
  app.get('/github/repos', function(req, res) {
    return Services.Github.fetch_repos(function(err, body) {
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
