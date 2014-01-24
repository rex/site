kue = require 'kue'
redis = require 'redis'
config = require '../config'
logger = require '../lib/logger'
BaseDriver = require './base'
mongo = require './mongo'
queue_item = mongo.model 'queue_item'

class QueueDriver extends BaseDriver

  constructor: (callback = ->) ->
    @debug = config.debug
    @instance = kue
    @queues = {}
    @handlers = {}
    @job_count = 0
    @active_jobs = 0
    @failed_jobs = 0
    @completed_jobs = 0
    callback()

  initialize: (queue_initialized = ->) ->
    @instance.redis.createClient = ->
      redis.createClient config.redis.port, config.redis.host

    queue_initialized()

  add_queue: (queue_name) ->
    unless queue_name then return logger.error "Queue name required to create new queue"

    @queues[queue_name] = kue.createQueue()

  add_handler: (params) ->
    unless params.queue_name and params.job_name then return logger.error "Queue name and Job name required when creating a queue handler"

    queue_name = params.queue
    job_name = params.job_name
    concurrency = params.concurrency or 1

    @queues[queue_name].process job_name, concurrency, (job, done = ->) ->
      queue_item.start job, ->
        handler job, done

  add_job: (params, job_created = ->) ->
    self = this

    unless params.queue_name and params.job_name and params.data then return logger.error "Queue name, job name, and data required to create a new job"

    queue_name = params.queue_name
    job_name = params.job_name
    job_data =  params.data or {}
    job_priority = params.priority or 0
    allowed_attempts = params.attempts or 1
    on_complete = params.complete or ->
    on_error = params.error or ->
    on_progress = params.progress or ->

    unless _.has @queues, queue_name then return logger.error "Invalid queue name specified: #{queue_name}"

    job = @queues[queue_name]
      .create job_name, job_data
      .priority job_priority
      .attempts allowed_attempts
      .save()

    stored_job = new queue_item
      job_id: job.id
      queue_name: queue_name
      job_name: job.type
      job_data: job.data
      priority: job.priority
      state: job.state
      attempts: job.attempts
      created_at: job.created_at
      updated_at: job.updated_at

    stored_job.save (err) ->
      logger.error "Unable to save new queue item", err, job

    # Add our event listeners
    job
      .on 'complete', ->
        self.active_jobs--
        self.completed_jobs++
        queue_item.complete job
        on_complete job
      .on 'failed', ->
        self.active_jobs--
        self.failed_jobs++
        queue_item.failed job
        on_error job
      .on 'progress', ->
        queue_item.progress job
        on_progress job

    job_created job


module.exports = new QueueDriver