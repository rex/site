logger = require '../lib/logger'
async = require 'async'
mongoose = require 'mongoose'
_ = require '../lib/_'

Models =
  activity: mongoose.model 'activity'
  job: mongoose.model 'job'
  link: mongoose.model 'link'
  post: mongoose.model 'post'
  snippet: mongoose.model 'tag'
  commits: mongoose.model 'github_commit'
  repos: mongoose.model 'github_repo'
  oauth_token: mongoose.model 'oauth_token'


module.exports = (app) ->
  app.get '/dump', (req, res) ->
    async.series
      links: (complete) ->
        Models.link.find {}, (err, links) ->
          complete err, links
      jobs: (complete) ->
        Models.job.find {}, (err, jobs) ->
          complete err, jobs
      activity: (complete) ->
        Models.activity.find {}, (err, activities) ->
          complete err, activities
      posts: (complete) ->
        Models.post.find {}, (err, posts) ->
          complete err, posts
      snippets: (complete) ->
        Models.snippet.find {}, (err, snippets) ->
          complete err, snippets
      commits: (complete) ->
        Models.commits.find {}, (err, commits) ->
          complete err, commits
      repos: (complete) ->
        Models.repos.find {}, (err, repos) ->
          complete err, repos
      oauth_tokens: (complete) ->
        Models.oauth_token.find {}, (err, tokens) ->
          complete err, tokens
    , (err, results) ->
      res.json results

  app.get '/populate', (req, res) ->
    links = [
      {
        created_on: new Date()
        title: 'GITHUB'
        href: 'https://github.com/rex'
        icon: '.github'
      }
      {
        created_on: new Date()
        title: 'NPM'
        href: 'http://npmjs.org~piercemoore'
      }
      {
        created_on: new Date()
        title: 'TWITTER'
        href: 'http://twitter.com/kiapierce'
      }
      {
        created_on: new Date()
        title: 'LINKEDIN'
        href: 'https://www.linkedin.com/in/piercemoore'
      }
    ]

    jobs = [
      {
        title: 'WEB DEVELOPER'
        company: 'Zngine'
        date_started: _.date '2013-08-01'
        date_ended: _.date '2014-01-10'
        city: 'Irving'
        state: 'Texas'
        image: 'zngine_logo.png'
        summary: 'Brought on as a full-time developer with Zngine after almost a year building the application as a contractor with Sq1, I was tasked with continuing the forward progress and success of our development effort.'
        tasks: [
          'Balanced my time between building new features and refactoring application code to adapt to constantly changing business needs.'
          'Implemented coding standards, usability guidelines, and thorough unit testing for all javascript endpoints, both client- and server-side.'
        ]
      }
      {
        title: 'PHP DEVELOPER'
        company: 'Sq1 Agency'
        project: 'Zngine Project'
        date_started: _.date '2012-10-27'
        date_ended: _.date '2013-08-01'
        city: 'Dallas'
        state: 'Texas'
        image: 'sq1_logo.jpg'
        summary: 'Built a large-scale, high-availability music-oriented social network designed to revolutionize the music industry by bringing artists, fans, record labels, and venues together in the same place.'
        tasks: [
          'Leveraged powerful technologies like Node.js, Express, Mongoose, MongoDB, and Backbone.js to build an advanced web application entirely in AJAX that lives outside of standard page reload as well as providing real HTML pages to allow search engine crawling.'
          'Implemented responsive design patterns to provide a consistent end-user experience on any device and screen resolution.'
          'Helped build an advanced, fully object-oriented PHP framework that efficiently and very quickly loads the user’s web experience.'
          'Implemented a Node.js data service running Express 3.0 and using Mongoose as an abstraction layer for MongoDB communication.'
          'Built a RESTful API, which provides data to the application and database using semantic and extensible naming conventions.'
        ]
      }
      {
        title: 'SENIOR PHP DEVELOPER'
        company: 'Latimundo'
        date_started: _.date '2012-02-01'
        date_ended: _.date '2012-10-20'
        city: 'Dallas'
        state: 'Texas'
        summary: 'Latimundo provides media production and digital effects services as well as offers digital animation rendering services to numerous clients in the Dallas/Fort Worth Metroplex.'
        tasks: [
          'Configure, secure, and maintain high availability Linux web servers.'
          'Design, build, deploy, and maintain PHP web applications in multiple high-traffic web properties.'
        ]
      }
      {
        title: 'DIRECTOR OF BUSINESS DEVELOPMENT'
        company: 'Zee-Way'
        date_started: _.date '2010'
        city: 'Dallas'
        state: 'Texas'
        summary: 'Increase revenue and expand availability to offer semi-managed shared, virtual, and dedicated server hosting to clients in the US and around the world.'
        tasks: [
          'Coordinate business relationships with incoming and existing clients.'
          'Assist in overseeing web development and new service features.'
        ]
        current: true
      }
      {
        title: 'FOUNDER / FREELANCER'
        company: 'Refreshed Web Design'
        date_started: _.date '2009-01'
        date_ended: _.date '2012-01'
        city: 'Dallas'
        state: 'Texas'
        summary: 'Founded a small freelance web development firm targeting clients interested in building and maintaining an active web presence.'
        tasks: [
          'Specialization in PHP-based web application development.'
          'Freelance business, offering solutions for clients’ needs ranging from productivity management to telephony.'
        ]
      }
      {
        title: 'SALES SPECIALIST'
        company: 'Limestone Networks'
        date_started: _.date '2008-08'
        date_ended: _.date '2009-04'
        city: 'Dallas'
        state: 'Texas'
        image: 'limestone_logo.jpg'
        summary: 'Handled incoming sales and business opportunities in an unmanaged dedicated hosting environment.'
        tasks: [
          'Generated, analyzed, and presented client, inventory, and sales data metrics.'
          'Assisted clients over chat-, email-, and phone-based support channels.'
          'Financial monitoring, including chargeback tracking and invoice management.'
        ]
      }
    ]

    async.series [
      (complete) ->
        Models.link.remove {}, (err) ->
          complete err, 'Drop Links'
      (complete) ->
        Models.job.remove {}, (err) ->
          complete err, 'Drop Jobs'
      (complete) ->
        async.each links, (link, done) ->
          # logger "Creating link: #{link.title}"
          Link = new Models.link link
          Link.save (err) ->
            done err
        , (err) ->
          complete err, 'Links'
      (complete) ->
        async.each jobs, (job, done) ->
          # logger "Creating job: #{job.title}"
          Job = new Models.job job
          Job.save (err) ->
            done err
        , (err) ->
            complete err, 'Jobs'
    ], (err, results) ->
      if err
        logger.error "Error populating DB", err
      else
        logger "DB Populated!", results

      res.json results
