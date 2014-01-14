var github;

github = require('../lib/github');

module.exports = function(app) {
  app.get('/repos*', function(req, res) {
    return github.repos(function(err, body) {
      return res.render('code/repos', {
        repos: body,
        uri: req.path
      });
    });
  });
  return app.get('/snippets*', function(req, res) {
    return res.render('code/snippets', {
      env: process.env,
      path: req.path
    });
  });
};
