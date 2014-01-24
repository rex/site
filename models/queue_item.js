var QueueItemSchema, config, logger, mongo;

mongo = require('../drivers/mongo');

logger = require('../lib/logger');

config = require('../config');

QueueItemSchema = new mongo.Schema({
  job_id: {
    type: Number,
    index: true
  },
  queue_name: {
    type: String,
    index: true
  },
  job_name: {
    type: String
  },
  job_data: {
    type: Object
  },
  priority: {
    type: Number,
    "default": 0
  },
  progress: {
    type: Number
  },
  attempts: {
    type: Number,
    "default": 1
  },
  state: {
    type: String,
    "enum": ['active', 'inactive', 'failed', 'complete'],
    "default": 'inactive'
  },
  created_at: {
    type: Date
  },
  updated_at: {
    type: Date,
    "default": Date.now()
  },
  duration: {
    type: Number
  },
  log: [
    {
      event: {
        type: String
      },
      value: {
        type: mongo.Schema.Types.Mixed
      },
      timestamp: {
        type: Date
      }
    }
  ]
});

QueueItemSchema["static"]('start', function(job, callback) {
  if (job == null) {
    job = {};
  }
  if (callback == null) {
    callback = function() {};
  }
  return this.findOneAndUpdate({
    job_id: job.id
  }, {
    $set: {
      state: 'active'
    },
    $push: {
      log: {
        event: 'started',
        timestamp: Date.now()
      }
    }
  }, function(err, stored_job) {
    logger.error("Unable to update started job", err);
    return callback(stored_job);
  });
});

QueueItemSchema["static"]('complete', function(job, callback) {
  if (job == null) {
    job = {};
  }
  if (callback == null) {
    callback = function() {};
  }
  return this.findOneAndUpdate({
    job_id: job.id
  }, {
    $set: {
      state: 'complete',
      duration: job.duration
    },
    $push: {
      log: {
        event: 'complete',
        timestamp: Date.now()
      }
    }
  }, function(err, stored_job) {
    logger.error("Unable to update completed job", err);
    return callback(stored_job);
  });
});

QueueItemSchema["static"]('progress', function(job, callback) {
  if (job == null) {
    job = {};
  }
  if (callback == null) {
    callback = function() {};
  }
  return this.findOneAndUpdate({
    job_id: job.id
  }, {
    $set: {
      progress: job.progress
    },
    $push: {
      log: {
        event: 'progress',
        value: job.progress,
        timestamp: Date.now()
      }
    }
  }, function(err, stored_job) {
    logger.error("Unable to update job progress", err);
    return callback(stored_job);
  });
});

QueueItemSchema["static"]('failed', function(job, callback) {
  if (job == null) {
    job = {};
  }
  if (callback == null) {
    callback = function() {};
  }
  return this.findOneAndUpdate({
    job_id: job.id
  }, {
    $set: {
      state: 'failed'
    },
    $push: {
      log: {
        event: 'failed',
        timestamp: Date.now()
      }
    }
  }, function(err, stored_job) {
    logger.error("Unable to update failed job", err);
    return callback(stored_job);
  });
});

module.exports = QueueItemSchema;
