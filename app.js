var app, express, http, logger, server, _;

logger = require('./lib/logger');

_ = require('./lib/_');

express = require('express');

http = require('http');

app = express();

app.configure(function() {
  app.set('port', process.env.VCAP_APP_PORT || 3000);
  app.engine('jade', require('jade').__express);
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
    res.locals.req = {
      xhr: req.xhr,
      path: req.originalUrl,
      pjax: req.headers['X-PJAX'] != null ? true : false
    };
    res.locals._ = _;
    res.locals.me = "Pierce";
    return next();
  });
  return app.use(app.router);
});

app.configure('development', function() {
  return app.use(express.errorHandler());
});

app.configure('production', function() {});

require('./controllers')(app);

server = http.createServer(app).listen(app.get('port'), function() {
  return logger("prex.io running on port " + (app.get('port')));
});

logger("Loaded Routes:");

_.each(app.routes, function(methods, verb) {
  console.log("" + verb + " methods: (" + methods.length + ")");
  return _.each(_.pluck(methods, 'path'), function(path) {
    return console.log(" > " + path);
  });
});
