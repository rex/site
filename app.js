var app, async, config, debug, express, http, logger, mongo, redis, step, _;

logger = require('./lib/logger');

_ = require('./lib/_');

async = require('async');

express = require('express');

http = require('http');

step = require('./lib/step');

config = require('./config');

debug = config.debug;

app = express();

redis = require('./drivers/redis');

mongo = require('./drivers/mongo');

async.series({
  connect_to_redis: function(done) {
    step.start("Connecting to Redis");
    return redis.initialize(function() {
      step.complete();
      return done();
    });
  },
  initialize_models: function(done) {
    var models;
    step.start("Initializing Mongo");
    models = require('./models');
    return models.initialize(function() {
      step.complete();
      return done();
    });
  },
  env: function(done) {
    step.start("Update environment variables in database");
    return require('./env')(function() {
      step.complete();
      return done();
    });
  },
  load_env: function(done) {
    step.start("Loading environment variables");
    return require('./lib/load_env')(function() {
      step.complete();
      return done();
    });
  },
  configure_app: function(done) {
    step.start("Configuring application");
    return app.configure(function() {
      app.set('port', config.app.port || 3000);
      app.set('host', config.app.host || 'localhost');
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
      app.use(express.json());
      app.use(express.urlencoded());
      app.use(express.methodOverride());
      step.complete();
      return done();
    });
  },
  attach_middleware: function(done) {
    var Visit;
    step.start("Attaching application middleware");
    Visit = mongo.model('visit');
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
      if (req.query) {
        logger("Query string params:", req.query);
      }
      if (_.has(req.query, 'json')) {
        logger("JSON response requested for URL: " + req.originalUrl);
        req.json_requested = true;
      }
      return next();
    });
    app.use(app.router);
    step.complete();
    return done();
  },
  post_middleware: function(done) {
    step.start("Running post-middleware hook");
    app.configure('development', function() {
      return app.use(express.errorHandler());
    });
    app.configure('production', function() {});
    step.complete();
    return done();
  },
  init_controllers: function(done) {
    step.start("Initializing controllers");
    require('./controllers')(app);
    step.complete();
    return done();
  },
  display_routes: function(done) {
    if (debug) {
      logger("Loaded Routes:");
      _.each(app.routes, function(methods, verb) {
        logger("" + verb + " methods: (" + methods.length + ")");
        return _.each(_.pluck(methods, 'path'), function(path) {
          return logger(" > " + path);
        });
      });
    }
    return done();
  }
}, function(err, results) {
  var server;
  if (err) {
    return logger.error(err);
  } else {
    step.start("Booting application");
    return server = http.createServer(app).listen(app.get('port'), app.get('host'), function() {
      step.complete();
      return logger("prex.io running at " + (app.get('host')) + " on port " + (app.get('port')));
    });
  }
});
