kue = require 'kue'
redis = require 'redis'
config = require '../config'
logger = require '../lib/logger'
_ = require '../lib/_'
BaseDriver = require './base'
Mongo = require './mongo'

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
    queue_initialized()

  add_queue: (queue_name) ->
    unless queue_name then return logger.error "Queue name required to create new queue"

    @queues[queue_name] = kue.createQueue()
    @handlers[queue_name] = {}

  add_handler: (params) ->
    unless params.queue_name and params.job_name then return logger.error "Queue name and Job name required when creating a queue handler"

    queue_name = params.queue_name
    job_name = params.job_name
    concurrency = params.concurrency or 1
    handler = params.handler or ->

    @queues[queue_name].process job_name, concurrency, handler

    @handlers[queue_name][job_name] = handler

  add_job: (params, job_created = ->) ->
    self = this

    unless params.queue_name and params.job_name and params.job_data then return logger.error "Queue name, job name, and data required to create a new job"

    queue_name = params.queue_name
    job_name = params.job_name
    job_data =  params.job_data or {}
    job_priority = params.priority or 0
    allowed_attempts = params.attempts or 1
    on_saved = params.saved or ->
    on_complete = params.complete or ->
    on_error = params.error or ->
    on_progress = params.progress or ->

    unless _.has @queues, queue_name then return logger.error "Invalid queue name specified: #{queue_name}"

    # logger "Creating new job"

    job = @queues[queue_name].create(job_name, job_data).save() # .priority(job_priority).attempts(allowed_attempts)

    # Add our event listeners
    job
      .on 'complete', ->
        @debug and logger "Job complete: #{job.id}"
        self.active_jobs--
        self.completed_jobs++
        on_complete job
      .on 'failed', ->
        @debug and logger.error "Job failed: #{job.id}"
        self.active_jobs--
        self.failed_jobs++
        on_error job
      .on 'progress', ->
        @debug and logger "Job progress: #{job.id} - #{job.progress}%"
        on_progress job

    job_created null, job


module.exports = new QueueDriver