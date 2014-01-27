Schema = require('../drivers/mongo').Schema

LinkSchema = new Schema
  created_on:
    type: Date
  last_updated:
    type: Date
    default: Date.now
  title:
    type: String
  href:
    type: String
  icon:
    type: String
  visible:
    type: Boolean
    default: true

module.exports = LinkSchema