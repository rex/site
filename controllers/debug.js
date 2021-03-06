var Redis, Services, config, generic_callback, logger, mongo, _;

logger = require('../lib/logger');

_ = require('../lib/_');

config = require('../config');

mongo = require('../drivers/mongo');

Redis = require('../drivers/redis');

Services = {
  Github: require('../services/github'),
  Instagram: require('../services/instagram'),
  Twitter: require('../services/twitter'),
  iTunes: require('../services/itunes')
};

generic_callback = function(err, body) {
  return res.json({
    err: err,
    body: body
  });
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
    return Services.Github.fetch_recent_activity(res.generic_callback);
  });
  app.get('/github/repos', function(req, res) {
    return Services.Github.fetch_repos(res.generic_callback);
  });
  app.get('/github/user/:login', function(req, res) {
    return Services.Github.fetch_user(req.params.login, res.generic_callback);
  });
  app.get('/github/repo/:login/:name', function(req, res) {
    var repo_full_name;
    repo_full_name = "" + req.params.login + "/" + req.params.name;
    return Services.Github.fetch_repo(repo_full_name, res.generic_callback);
  });
  app.get('/github/commits/:login/:name/:sha', function(req, res) {
    var repo_full_name;
    repo_full_name = "" + req.params.login + "/" + req.params.name;
    return Services.Github.fetch_commit(repo_full_name, req.params.sha, res.generic_callback);
  });
  app.get('/github/commits/:login/:name', function(req, res) {
    var repo_full_name;
    repo_full_name = "" + req.params.login + "/" + req.params.name;
    return Services.Github.fetch_commits(repo_full_name, res.generic_callback);
  });
  app.get('/services/github', function(req, res) {
    var G, entity;
    entity = req.query.entity;
    G = Services.Github;
    switch (entity) {
      case "user":
        return G.fetch_user(req.query.login, res.generic_callback);
      case "user_repos":
        return G.fetch_repos_by_user(req.query.login, res.generic_callback);
      case "user_gists":
        return G.fetch_gists_by_user(req.query.login, res.generic_callback);
      default:
        return res.send(500, "No valid entity specified");
    }
  });
  app.get('/services/instagram', function(req, res) {
    var I, entity;
    entity = req.query.entity;
    I = Services.Instagram;
    switch (entity) {
      case "user":
        return I.fetch_user(req.query.user_id, res.generic_callback);
      case "feed":
        return I.fetch_user_feed(res.generic_callback);
      case "user_media":
        return I.fetch_media_by_user(req.query.user_id, res.generic_callback);
      case "user_likes":
        return I.fetch_likes_by_user(res.generic_callback);
      case "user_follows":
        return I.fetch_follows_by_user(req.query.user_id, res.generic_callback);
      case "user_followers":
        return I.fetch_followers_by_user(req.query.user_id, res.generic_callback);
      case "user_follower_requests":
        return I.fetch_follow_requests_by_user(req.query.user_id, res.generic_callback);
      case "media":
        return I.fetch_media(req.query.media_id, res.generic_callback);
      case "media_comments":
        return I.fetch_comments_by_media(req.query.media_id, res.generic_callback);
      case "media_likes":
        return I.fetch_likes_by_media(req.query.media_id, res.generic_callback);
      default:
        return res.send(500, "No valid entity specified");
    }
  });
  app.get('/services/itunes', function(req, res) {
    var I, entity;
    entity = req.query.entity;
    I = Services.iTunes;
    switch (entity) {
      case "artist":
        return I.fetch_artist(req.query.artist_id, res.generic_callback);
      case "artist_albums":
        return I.fetch_albums_by_artist(req.query.artist_id, res.generic_callback);
      case "album_tracks":
        return I.fetch_tracks_by_album(req.query.album_upc, res.generic_callback);
      default:
        return res.send(500, "No valid entity specified");
    }
  });
  app.get('/services/twitter', function(req, res) {
    var T, entity;
    entity = req.query.entity;
    T = Services.Twitter;
    switch (entity) {
      case "timeline":
        return T.fetch_timeline(res.generic_callback);
      case "following":
        return T.fetch_following(res.generic_callback);
      case "followers":
        return T.fetch_followers(res.generic_callback);
      case "mentions":
        return T.fetch_mentions(res.generic_callback);
      case "retweets":
        return T.fetch_retweets(res.generic_callback);
      case "blocks":
        return T.fetch_blocks(res.generic_callback);
      case "settings":
        return T.fetch_settings(res.generic_callback);
      case "favorites":
        return T.fetch_favorites(res.generic_callback);
      case "lists":
        return T.fetch_lists(res.generic_callback);
      case "list_memberships":
        return T.fetch_list_memberships(res.generic_callback);
      case "media":
        return T.fetch_media(res.generic_callback);
      default:
        return res.send(500, "No valid entity specified");
    }
  });
  return app.get('/', function(req, res) {
    return res.sendfile('views/index.html');
  });
};
