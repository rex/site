module.exports = function(app) {
  return app.get('/code', function(req, res) {
    return res.render('code/index', process.env);
  });
};
