var instagram;

instagram = require('../../services/instagram');

module.exports = function(app) {
  app.post('/webhooks/instagram', function(req, res) {});
  return app.get('/instagram/likes', function(req, res) {
    return instagram.fetch_recent_likes(function(err, data) {
      if (err) {
        return res.send(500, err);
      } else {
        return res.json(data);
      }
    });
  });
};
