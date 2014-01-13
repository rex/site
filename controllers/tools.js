module.exports = function(app) {
  return app.get('/tools', function(req, res) {
    return res.render('tools/index', {
      env: process.env
    });
  });
};
