Schema = require('mongoose').Schema

ActivitySchema = new Schema
  created_on:
    type: Date
    required: true
    index: true
  redis_key:
    type: String
    required: true
    index:
      unique: true
  visible:
    type: Boolean
    default: true

module.exports = ActivitySchema