var auth;

auth = require('../lib/auth');

module.exports = function(app) {
  return app.get('/admin', auth, function(req, res) {
    return res.render('admin/login', {
      env: process.env
    });
  });
};
