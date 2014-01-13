module.exports = function(app) {
  return app.get('/bookmarks', function(req, res) {
    return res.render('bookmarks/index', {
      env: process.env
    });
  });
};
