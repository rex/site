var Activity, logger, mongoose;

logger = require('../../lib/logger');

mongoose = require('mongoose');

Activity = mongoose.model('activity');

module.exports = function(app) {
  return app.post('/webhooks/github', function(req, res) {
    var activity, payload;
    logger("Received github webhook!");
    payload = JSON.parse(decodeURIComponent(req.body.payload));
    activity = new Activity();
    logger("Creating activity");
    return activity.fromGithubWebhook(payload, function(err) {
      if (err) {
        return res.json({
          err: err
        });
      } else {
        return res.json({
          success: true
        });
      }
    });
  });
};
