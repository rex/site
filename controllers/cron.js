module.exports = function(app) {
  return app.post('/cron', function(req, res) {
    var body, interval;
    body = decodeURIComponent(req.body);
    interval = body.interval;
    return res.json({
      interval: interval
    });
  });
};
