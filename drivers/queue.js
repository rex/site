var BaseDriver, Mongo, QueueDriver, config, kue, logger, redis, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

kue = require('kue');

redis = require('redis');

config = require('../config');

logger = require('../lib/logger');

_ = require('../lib/_');

BaseDriver = require('./base');

Mongo = require('./mongo');

QueueDriver = (function(_super) {
  __extends(QueueDriver, _super);

  function QueueDriver(callback) {
    if (callback == null) {
      callback = function() {};
    }
    this.debug = config.debug;
    this.instance = kue;
    this.queues = {};
    this.handlers = {};
    this.job_count = 0;
    this.active_jobs = 0;
    this.failed_jobs = 0;
    this.completed_jobs = 0;
    callback();
  }

  QueueDriver.prototype.initialize = function(queue_initialized) {
    if (queue_initialized == null) {
      queue_initialized = function() {};
    }
    return queue_initialized();
  };

  QueueDriver.prototype.add_queue = function(queue_name) {
    if (!queue_name) {
      return logger.error("Queue name required to create new queue");
    }
    this.queues[queue_name] = kue.createQueue();
    return this.handlers[queue_name] = {};
  };

  QueueDriver.prototype.add_handler = function(params) {
    var concurrency, handler, job_name, queue_name;
    if (!(params.queue_name && params.job_name)) {
      return logger.error("Queue name and Job name required when creating a queue handler");
    }
    queue_name = params.queue_name;
    job_name = params.job_name;
    concurrency = params.concurrency || 1;
    handler = params.handler || function() {};
    this.queues[queue_name].process(job_name, concurrency, handler);
    return this.handlers[queue_name][job_name] = handler;
  };

  QueueDriver.prototype.add_job = function(params, job_created) {
    var allowed_attempts, job, job_data, job_name, job_priority, on_complete, on_error, on_progress, on_saved, queue_name, self;
    if (job_created == null) {
      job_created = function() {};
    }
    self = this;
    if (!(params.queue_name && params.job_name && params.job_data)) {
      return logger.error("Queue name, job name, and data required to create a new job");
    }
    queue_name = params.queue_name;
    job_name = params.job_name;
    job_data = params.job_data || {};
    job_priority = params.priority || 0;
    allowed_attempts = params.attempts || 1;
    on_saved = params.saved || function() {};
    on_complete = params.complete || function() {};
    on_error = params.error || function() {};
    on_progress = params.progress || function() {};
    if (!_.has(this.queues, queue_name)) {
      return logger.error("Invalid queue name specified: " + queue_name);
    }
    job = this.queues[queue_name].create(job_name, job_data).save();
    job.on('complete', function() {
      this.debug && logger("Job complete: " + job.id);
      self.active_jobs--;
      self.completed_jobs++;
      return on_complete(job);
    }).on('failed', function() {
      this.debug && logger.error("Job failed: " + job.id);
      self.active_jobs--;
      self.failed_jobs++;
      return on_error(job);
    }).on('progress', function() {
      this.debug && logger("Job progress: " + job.id + " - " + job.progress + "%");
      return on_progress(job);
    });
    return job_created(null, job);
  };

  return QueueDriver;

})(BaseDriver);

module.exports = new QueueDriver;
