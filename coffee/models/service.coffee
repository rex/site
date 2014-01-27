Schema = require('../drivers/mongo').Schema

ServiceSchema = new Schema
  name:
    type: String
    required: true
    index:
      unique: true
