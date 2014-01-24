var BaseDriver, QueueDriver, config, kue, logger, mongo, queue_item, redis,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

kue = require('kue');

redis = require('redis');

config = require('../config');

logger = require('../lib/logger');

BaseDriver = require('./base');

mongo = require('./mongo');

queue_item = mongo.model('queue_item');

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
    this.instance.redis.createClient = function() {
      return redis.createClient(config.redis.port, config.redis.host);
    };
    return queue_initialized();
  };

  QueueDriver.prototype.add_queue = function(queue_name) {
    if (!queue_name) {
      return logger.error("Queue name required to create new queue");
    }
    return this.queues[queue_name] = kue.createQueue();
  };

  QueueDriver.prototype.add_handler = function(params) {
    var concurrency, job_name, queue_name;
    if (!(params.queue_name && params.job_name)) {
      return logger.error("Queue name and Job name required when creating a queue handler");
    }
    queue_name = params.queue;
    job_name = params.job_name;
    concurrency = params.concurrency || 1;
    return this.queues[queue_name].process(job_name, concurrency, function(job, done) {
      if (done == null) {
        done = function() {};
      }
      return queue_item.start(job, function() {
        return handler(job, done);
      });
    });
  };

  QueueDriver.prototype.add_job = function(params, job_created) {
    var allowed_attempts, job, job_data, job_name, job_priority, on_complete, on_error, on_progress, queue_name, self, stored_job;
    if (job_created == null) {
      job_created = function() {};
    }
    self = this;
    if (!(params.queue_name && params.job_name && params.data)) {
      return logger.error("Queue name, job name, and data required to create a new job");
    }
    queue_name = params.queue_name;
    job_name = params.job_name;
    job_data = params.data || {};
    job_priority = params.priority || 0;
    allowed_attempts = params.attempts || 1;
    on_complete = params.complete || function() {};
    on_error = params.error || function() {};
    on_progress = params.progress || function() {};
    if (!_.has(this.queues, queue_name)) {
      return logger.error("Invalid queue name specified: " + queue_name);
    }
    job = this.queues[queue_name].create(job_name, job_data.priority(job_priority.attempts(allowed_attempts.save())));
    stored_job = new queue_item({
      job_id: job.id,
      queue_name: queue_name,
      job_name: job.type,
      job_data: job.data,
      priority: job.priority,
      state: job.state,
      attempts: job.attempts,
      created_at: job.created_at,
      updated_at: job.updated_at
    });
    stored_job.save(function(err) {
      return logger.error("Unable to save new queue item", err, job);
    });
    job.on('complete', function() {
      self.active_jobs--;
      self.completed_jobs++;
      queue_item.complete(job);
      return on_complete(job);
    }).on('failed', function() {
      self.active_jobs--;
      self.failed_jobs++;
      queue_item.failed(job);
      return on_error(job);
    }).on('progress', function() {
      queue_item.progress(job);
      return on_progress(job);
    });
    return job_created(job);
  };

  return QueueDriver;

})(BaseDriver);

module.exports = new QueueDriver;
