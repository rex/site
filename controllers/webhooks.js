module.exports = function(app) {
  app.get('/webhooks', function(req, res) {
    return res.json({
      instagram: "aight",
      github: "fuck yeah",
      twitter: "you fuckin know it"
    });
  });
  app.post('/webhooks/instagram', function(req, res) {});
  app.post('/webhooks/github', function(req, res) {});
  return app.post('/webhooks/twitter', function(req, res) {});
};
