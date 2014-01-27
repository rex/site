var Models, async, logger, mongo, _;

logger = require('../lib/logger');

async = require('async');

mongo = require("../drivers/mongo");

_ = require('../lib/_');

Models = {
  Activity: mongo.model('activity'),
  Job: mongo.model('job'),
  Link: mongo.model('link'),
  Post: mongo.model('post'),
  Snippet: mongo.model('tag'),
  Github_Commit: mongo.model('github_commit'),
  Github_Repo: mongo.model('github_repo'),
  OAuth_Token: mongo.model('oauth_token')
};

module.exports = function(app) {
  app.get('/dump', function(req, res) {
    return async.series({
      links: function(complete) {
        return Models.Link.find({}, function(err, links) {
          return complete(err, links);
        });
      },
      jobs: function(complete) {
        return Models.Job.find({}, function(err, jobs) {
          return complete(err, jobs);
        });
      },
      activity: function(complete) {
        return Models.Activity.find({}, function(err, activities) {
          return complete(err, activities);
        });
      },
      posts: function(complete) {
        return Models.Post.find({}, function(err, posts) {
          return complete(err, posts);
        });
      },
      snippets: function(complete) {
        return Models.Snippet.find({}, function(err, snippets) {
          return complete(err, snippets);
        });
      },
      commits: function(complete) {
        return Models.Github_Commit.find({}, function(err, commits) {
          return complete(err, commits);
        });
      },
      repos: function(complete) {
        return Models.Github_Repo.find({}, function(err, repos) {
          return complete(err, repos);
        });
      },
      oauth_tokens: function(complete) {
        return Models.OAuth_Token.find({}, function(err, tokens) {
          return complete(err, tokens);
        });
      }
    }, function(err, results) {
      return res.json(results);
    });
  });
  return app.get('/populate', function(req, res) {
    var jobs, links;
    links = [
      {
        created_on: new Date(),
        title: 'GITHUB',
        href: 'https://github.com/rex',
        icon: '.github'
      }, {
        created_on: new Date(),
        title: 'NPM',
        href: 'http://npmjs.org~piercemoore'
      }, {
        created_on: new Date(),
        title: 'TWITTER',
        href: 'http://twitter.com/kiapierce'
      }, {
        created_on: new Date(),
        title: 'LINKEDIN',
        href: 'https://www.linkedin.com/in/piercemoore'
      }
    ];
    jobs = [
      {
        title: 'WEB DEVELOPER',
        company: 'Zngine',
        date_started: _.date('2013-08-01'),
        date_ended: _.date('2014-01-10'),
        city: 'Irving',
        state: 'Texas',
        image: 'zngine_logo.png',
        summary: 'Brought on as a full-time developer with Zngine after almost a year building the application as a contractor with Sq1, I was tasked with continuing the forward progress and success of our development effort.',
        tasks: ['Balanced my time between building new features and refactoring application code to adapt to constantly changing business needs.', 'Implemented coding standards, usability guidelines, and thorough unit testing for all javascript endpoints, both client- and server-side.']
      }, {
        title: 'PHP DEVELOPER',
        company: 'Sq1 Agency',
        project: 'Zngine Project',
        date_started: _.date('2012-10-27'),
        date_ended: _.date('2013-08-01'),
        city: 'Dallas',
        state: 'Texas',
        image: 'sq1_logo.jpg',
        summary: 'Built a large-scale, high-availability music-oriented social network designed to revolutionize the music industry by bringing artists, fans, record labels, and venues together in the same place.',
        tasks: ['Leveraged powerful technologies like Node.js, Express, Mongoose, MongoDB, and Backbone.js to build an advanced web application entirely in AJAX that lives outside of standard page reload as well as providing real HTML pages to allow search engine crawling.', 'Implemented responsive design patterns to provide a consistent end-user experience on any device and screen resolution.', 'Helped build an advanced, fully object-oriented PHP framework that efficiently and very quickly loads the user’s web experience.', 'Implemented a Node.js data service running Express 3.0 and using Mongoose as an abstraction layer for MongoDB communication.', 'Built a RESTful API, which provides data to the application and database using semantic and extensible naming conventions.']
      }, {
        title: 'SENIOR PHP DEVELOPER',
        company: 'Latimundo',
        date_started: _.date('2012-02-01'),
        date_ended: _.date('2012-10-20'),
        city: 'Dallas',
        state: 'Texas',
        summary: 'Latimundo provides media production and digital effects services as well as offers digital animation rendering services to numerous clients in the Dallas/Fort Worth Metroplex.',
        tasks: ['Configure, secure, and maintain high availability Linux web servers.', 'Design, build, deploy, and maintain PHP web applications in multiple high-traffic web properties.']
      }, {
        title: 'DIRECTOR OF BUSINESS DEVELOPMENT',
        company: 'Zee-Way',
        date_started: _.date('2010'),
        city: 'Dallas',
        state: 'Texas',
        summary: 'Increase revenue and expand availability to offer semi-managed shared, virtual, and dedicated server hosting to clients in the US and around the world.',
        tasks: ['Coordinate business relationships with incoming and existing clients.', 'Assist in overseeing web development and new service features.'],
        current: true
      }, {
        title: 'FOUNDER / FREELANCER',
        company: 'Refreshed Web Design',
        date_started: _.date('2009-01'),
        date_ended: _.date('2012-01'),
        city: 'Dallas',
        state: 'Texas',
        summary: 'Founded a small freelance web development firm targeting clients interested in building and maintaining an active web presence.',
        tasks: ['Specialization in PHP-based web application development.', 'Freelance business, offering solutions for clients’ needs ranging from productivity management to telephony.']
      }, {
        title: 'SALES SPECIALIST',
        company: 'Limestone Networks',
        date_started: _.date('2008-08'),
        date_ended: _.date('2009-04'),
        city: 'Dallas',
        state: 'Texas',
        image: 'limestone_logo.jpg',
        summary: 'Handled incoming sales and business opportunities in an unmanaged dedicated hosting environment.',
        tasks: ['Generated, analyzed, and presented client, inventory, and sales data metrics.', 'Assisted clients over chat-, email-, and phone-based support channels.', 'Financial monitoring, including chargeback tracking and invoice management.']
      }
    ];
    return async.series([
      function(complete) {
        return Models.Link.remove({}, function(err) {
          return complete(err, 'Drop Links');
        });
      }, function(complete) {
        return Models.Job.remove({}, function(err) {
          return complete(err, 'Drop Jobs');
        });
      }, function(complete) {
        return async.each(links, function(link, done) {
          var Link;
          Link = new Models.Link(link);
          return Link.save(function(err) {
            return done(err);
          });
        }, function(err) {
          return complete(err, 'Links');
        });
      }, function(complete) {
        return async.each(jobs, function(job, done) {
          var Job;
          Job = new Models.Job(job);
          return Job.save(function(err) {
            return done(err);
          });
        }, function(err) {
          return complete(err, 'Jobs');
        });
      }
    ], function(err, results) {
      if (err) {
        logger.error("Error populating DB", err);
      } else {
        logger("DB Populated!", results);
      }
      return res.json(results);
    });
  });
};
