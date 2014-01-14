var Jobs, mongoose;

mongoose = require('mongoose');

Jobs = mongoose.model('job');

module.exports = function(app) {
  return app.get('/resume', function(req, res) {
    return Jobs.find({}, function(err, jobs) {
      return res.render('resume/index', {
        jobs: jobs
      });
    });
  });
};
