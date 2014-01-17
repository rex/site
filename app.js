var Visit, app, express, http, logger, models, mongoose, server, _;

logger = require('./lib/logger');

mongoose = require('mongoose');

_ = require('./lib/_');

express = require('express');

http = require('http');

app = express();

models = require('./models');

models.initialize();

Visit = mongoose.model('visit');

app.configure(function() {
  app.set('port', process.env.VCAP_APP_PORT || 3000);
  app.set('host', process.env.VCAP_APP_HOST || 'localhost');
  app.engine('jade', require('jade').__express);
  app.enable('trust proxy');
  app.disable('view cache');
  app.set('view engine', 'jade');
  app.set('views', "" + (process.cwd()) + "/views");
  app.use(express.compress());
  app.use(express.favicon("" + __dirname + "/public/images/favicon.ico"));
  app.use(express["static"]("" + __dirname + "/public"));
  app.use(express.logger('short'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(function(req, res, next) {
    var visit;
    if (req.path.match(/^\/webhooks/)) {
      logger("Skipping webhook request: " + (req.path.replace('/webhooks/', '')));
      return next();
    } else {
      visit = new Visit;
      return visit.createFromRequest(req, res, next);
    }
  });
  app.use(function(req, res, next) {
    req.isPJAX = req.headers['X-PJAX'] != null ? true : false;
    res.locals.req = {
      xhr: req.xhr,
      path: req.originalUrl,
      isPJAX: req.isPJAX
    };
    res.locals._ = _;
    res.locals.me = "Pierce";
    return next();
  });
  app.use(function(req, res, next) {
    logger("Query string params:", req.query);
    if (_.has(req.query, 'json')) {
      logger("JSON response requested for URL: " + req.originalUrl);
      req.json_requested = true;
    }
    return next();
  });
  return app.use(app.router);
});

app.configure('development', function() {
  return app.use(express.errorHandler());
});

app.configure('production', function() {});

require('./controllers')(app);

server = http.createServer(app).listen(app.get('port'), app.get('host'), function() {
  return logger("prex.io running at " + (app.get('host')) + " on port " + (app.get('port')));
});

logger("Loaded Routes:");

_.each(app.routes, function(methods, verb) {
  logger("" + verb + " methods: (" + methods.length + ")");
  return _.each(_.pluck(methods, 'path'), function(path) {
    return logger(" > " + path);
  });
});
