module.exports = function(app) {
  return app.get('/admin', function(req, res) {
    return res.render('admin/index', {
      env: process.env
    });
  });
};
