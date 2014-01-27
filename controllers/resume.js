var Models, mongo;

mongo = require("" + (process.cwd()) + "/drivers/mongo");

Models = {
  Job: mongo.model('job')
};

module.exports = function(app) {
  return app.get('/resume', function(req, res) {
    return Models.Job.find({}, function(err, jobs) {
      return res.render('resume/index', {
        jobs: jobs
      });
    });
  });
};
