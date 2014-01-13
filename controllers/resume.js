module.exports = function(app) {
  return app.get('/resume', function(req, res) {
    return res.render('resume/index', {
      env: process.env
    });
  });
};
