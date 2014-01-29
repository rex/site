var app, async, colors, config, debug, express, http, logger, step, _;

logger = require('./lib/logger');

_ = require('./lib/_');

async = require('async');

express = require('express');

http = require('http');

step = require('./lib/step');

config = require('./config');

colors = config.colors;

debug = config.debug;

app = express();

async.series({
  load_app_env: function(done) {
    var env_app;
    step.start_major("Loading app config into environment");
    return env_app = require('./env_app')(function() {
      step.complete_major();
      return done();
    });
  },
  load_app_into_config: function(done) {
    step.start_major("Reloading app config");
    return config.load_app_config(function() {
      step.complete_major();
      return done();
    });
  },
  connect_to_redis: function(done) {
    var redis;
    step.start_major("Initializing Redis");
    redis = require('./drivers/redis');
    return redis.initialize(function() {
      step.complete_major();
      return done();
    });
  },
  initialize_models: function(done) {
    var models;
    step.start_major("Initializing Mongo");
    models = require('./models');
    return models.initialize(function() {
      step.complete_major();
      return done();
    });
  },
  env_services: function(done) {
    step.start_major("Update service credentials in database");
    return require('./env_services')(function() {
      step.complete_major();
      return done();
    });
  },
  load_env: function(done) {
    step.start_major("Loading service credentials into environment");
    return require('./lib/load_env')(function() {
      step.complete_major();
      return done();
    });
  },
  load_credentials_into_config: function(done) {
    step.start_major("Load service credentials into config");
    return config.load_services(function() {
      step.complete_major();
      return done();
    });
  },
  configure_app: function(done) {
    step.start_major("Configuring application");
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
      step.complete_major();
      return done();
    });
  },
  initialize_redis_session: function(done) {
    var Redis_Instance, Redis_Store, err;
    step.start_major("Initializing Redis Session");
    Redis_Instance = require('./drivers/redis').instance;
    if (!Redis_Instance) {
      err = new Error("No Redis instance found");
      step.fail(err);
      return done(err, null);
    }
    Redis_Store = require('connect-redis')(express);
    app.use(express.session({
      store: new Redis_Store({
        client: Redis_Instance
      }),
      secret: 'go rangers'
    }));
    step.complete_major();
    return done();
  },
  connect_to_queue: function(done) {
    var queue;
    step.start_major("Initializing Job Queue");
    queue = require('./drivers/queue');
    return queue.initialize(function() {
      step.complete_major();
      return done();
    });
  },
  initialize_workers: function(done) {
    var workers;
    step.start_major("Initializing Job Queue Workers");
    workers = require('./workers');
    return workers.initialize(function() {
      step.complete_major();
      return done();
    });
  },
  initialize_services: function(done) {
    var services;
    step.start_major("Initializing Services");
    services = require('./services');
    return services.initialize(function(err) {
      if (err != null) {
        step.error(err);
      } else {
        step.complete_major();
      }
      return done(err);
    });
  },
  attach_middleware: function(done) {
    step.start_major("Attaching application middleware");
    app.use(require('./middleware/log_visit'));
    app.use(require('./middleware/set_locals'));
    app.use(require('./middleware/detect_json_requests'));
    app.use(require('./middleware/debug_session'));
    app.use(app.router);
    step.complete_major();
    return done();
  },
  post_middleware: function(done) {
    step.start_major("Running post-middleware hook");
    app.configure('development', function() {
      return app.use(express.errorHandler());
    });
    app.configure('production', function() {});
    step.complete_major();
    return done();
  },
  init_controllers: function(done) {
    step.start_major("Initializing controllers");
    require('./controllers')(app);
    step.complete_major();
    return done();
  },
  display_routes: function(done) {
    step.group("Loaded Routes");
    _.each(app.routes, function(methods, verb) {
      return _.each(_.pluck(methods, 'path'), function(path) {
        var color;
        switch (verb) {
          case 'get':
            color = colors.blue;
            break;
          case 'put':
            color = colors.teal;
            break;
          case 'post':
            color = colors.green;
            break;
          case 'delete':
            color = colors.red;
        }
        return logger(" > " + color + (verb.toUpperCase()) + colors.reset + " " + path);
      });
    });
    step.groupEnd();
    return done();
  }
}, function(err, results) {
  var server;
  if (err) {
    return logger.error(err);
  } else {
    step.start_major("Booting application");
    return server = http.createServer(app).listen(app.get('port'), app.get('host'), function() {
      step.complete_major();
      return logger("prex.io running at " + (app.get('host')) + " on port " + (app.get('port')));
    });
  }
});
