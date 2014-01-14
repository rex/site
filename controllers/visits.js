var Visit, mongoose;

mongoose = require('mongoose');

Visit = mongoose.model('visit');

module.exports = function(app) {
  return app.get('/visits*', function(req, res) {
    return Visit.find().sort({
      timestamp: -1
    }).exec(function(err, recent_visits) {
      return res.json({
        err: err,
        visits: recent_visits
      });
    });
  });
};
