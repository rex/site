var ActivitySchema, Schema, logger, mongoose;

logger = require('../lib/logger');

mongoose = require('mongoose');

Schema = mongoose.Schema;

ActivitySchema = new Schema({
  created_on: {
    type: Date,
    "default": Date.now,
    index: true
  },
  service: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  type: {
    type: String,
    "default": 'update'
  },
  params: {
    type: Object,
    "default": {}
  },
  visible: {
    type: Boolean,
    "default": true
  }
});

ActivitySchema.methods.fromGithubWebhook = function(payload, callback) {
  this.set('service', 'github');
  this.set('type', 'post-receive-hook');
  this.set('params', payload);
  return this.save(function(err) {
    return callback(err);
  });
};

module.exports = ActivitySchema;
