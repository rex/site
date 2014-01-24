var JobSchema, Schema;

Schema = require('mongoose').Schema;

JobSchema = new Schema({
  created_on: {
    type: Date,
    "default": Date.now,
    index: true
  },
  title: {
    type: String
  },
  company: {
    type: String
  },
  project: {
    type: String
  },
  date_started: {
    type: Date
  },
  date_ended: {
    type: Date
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  image: {
    type: String
  },
  summary: {
    type: String
  },
  tasks: [
    {
      type: String
    }
  ],
  tags: {
    type: Array,
    "default": [],
    index: true
  },
  current: {
    type: Boolean,
    "default": false
  },
  visible: {
    type: Boolean,
    "default": true
  }
});

module.exports = JobSchema;
