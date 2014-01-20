var Github_Service, logger;

logger = require('../../lib/logger');

Github_Service = require('../../services/github');

module.exports = function(app) {
  return app.post('/webhooks/github', function(req, res) {
    var payload;
    logger("Received github webhook!");
    payload = JSON.parse(decodeURIComponent(req.body.payload));
    return Github_Service.process_webhook_activity(payload, function(err) {
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
