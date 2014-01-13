module.exports = function(app) {
  return app.get('/portfolio', function(req, res) {
    return res.render('portfolio/index', {
      env: process.env
    });
  });
};
