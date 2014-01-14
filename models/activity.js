var ActivitySchema, Schema, mongoose;

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

module.exports = ActivitySchema;
