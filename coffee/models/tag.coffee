Schema = require('../drivers/mongo').Schema

TagSchema = new Schema
  name:
    type: String
  slug:
    type: String
    lowercase: true
    index: true

module.exports = TagSchema