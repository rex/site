logger = require '../lib/logger'
mongoose = require 'mongoose'
Schema = mongoose.Schema

ActivitySchema = new Schema
  created_on:
    type: Date
    default: Date.now
    index: true
  service:
    type: String
    required: true
    lowercase: true
    index: true
  type:
    type: String
    default: 'update'
  params:
    type: Object
    default: {}
  visible:
    type: Boolean
    default: true

ActivitySchema.methods.fromGithubWebhook = (payload, callback) ->
  this.set 'service', 'github'
  this.set 'type', 'post-receive-hook'
  this.set 'params', payload
  this.save (err) ->
    callback err

module.exports = ActivitySchema