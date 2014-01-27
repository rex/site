Schema = require('../drivers/mongo').Schema

EnvSchema = new Schema
  created_on:
    type: Date
    default: Date.now
  key:
    type: String
    index:
      unique: true
  val:
    type: String

module.exports = EnvSchema
