var Redis, Services, config, logger, mongo, _;

logger = require('../lib/logger');

_ = require('../lib/_');

config = require('../config');

mongo = require('../drivers/mongo');

Redis = require('../drivers/redis');

Services = {
  Github: require('../services/github'),
  Instagram: require('../services/instagram')
};

module.exports = function(app) {
  app.get('/instagram', function(req, res) {
    return Services.Instagram.fetch_recent_activity(function(err, images) {
      if (err) {
        return res.send(500, err);
      } else {
        return res.json(images);
      }
    });
  });
  app.get('/redis', function(req, res) {
    logger("Fetching all keys");
    return Redis.list_keys(function(err, keys) {
      return console.error(err(err ? void 0 : res.json(keys)));
    });
  });
  app.get('/env', function(req, res) {
    return res.json({
      config: config,
      env: process.env
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
    return res.sendfile('views/index.html');
  });
};
