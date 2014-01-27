var Models, mongo;

mongo = require("" + (process.cwd()) + "/drivers/mongo");

Models = {
  Visit: mongo.model('visit')
};

module.exports = function(app) {
  return app.get('/visits*', function(req, res) {
    return Models.Visit.find().sort({
      timestamp: -1
    }).exec(function(err, recent_visits) {
      return res.render('visits/index', {
        visits: recent_visits
      });
    });
  });
};
