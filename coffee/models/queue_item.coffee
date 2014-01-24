mongo = require '../drivers/mongo'
logger = require '../lib/logger'
config = require '../config'

QueueItemSchema = new mongo.Schema
  job_id:
    type: Number
    index: true
  queue_name:
    type: String
    index: true
  job_name:
    type: String
  job_data:
    type: Object
  priority:
    type: Number
    default: 0
  progress:
    type: Number
  attempts:
    type: Number
    default: 1
  state:
    type: String
    enum: ['active', 'inactive', 'failed', 'complete']
    default: 'inactive'
  created_at:
    type: Date
  updated_at:
    type: Date
    default: Date.now()
  duration:
    type: Number
  log: [{
    event:
      type: String
    value:
      type: mongo.Schema.Types.Mixed
    timestamp:
      type: Date
  }]

QueueItemSchema.static 'start', (job = {}, callback = ->) ->
  this.findOneAndUpdate job_id: job.id,
    $set:
      state: 'active'
    $push:
      log:
        event: 'started'
        timestamp: Date.now()
  , (err, stored_job) ->
    logger.error "Unable to update started job", err
    callback stored_job

QueueItemSchema.static 'complete', (job = {}, callback = ->) ->
  this.findOneAndUpdate job_id: job.id,
    $set:
      state: 'complete'
      duration: job.duration
    $push:
      log:
        event: 'complete'
        timestamp: Date.now()
  , (err, stored_job) ->
    logger.error "Unable to update completed job", err
    callback stored_job

QueueItemSchema.static 'progress', (job = {}, callback = ->) ->
  this.findOneAndUpdate job_id: job.id,
    $set:
      progress: job.progress
    $push:
      log:
        event: 'progress'
        value: job.progress
        timestamp: Date.now()
  , (err, stored_job) ->
    logger.error "Unable to update job progress", err
    callback stored_job

QueueItemSchema.static 'failed', (job = {}, callback = ->) ->
  this.findOneAndUpdate job_id: job.id,
    $set:
      state: 'failed'
    $push:
      log:
        event: 'failed'
        timestamp: Date.now()
  , (err, stored_job) ->
    logger.error "Unable to update failed job", err
    callback stored_job

module.exports = QueueItemSchema