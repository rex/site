module.exports = function(app) {
  return app.get('/blog*', function(req, res) {
    return res.render('blog/index', {
      env: process.env,
      path: req.path
    });
  });
};
