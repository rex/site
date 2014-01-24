mongoose = require 'mongoose'
Schema = mongoose.Schema

UserSchema = new Schema
  username:
    type: String
    required: true
    index:
      unique: true
  password:
    type: String
    required: true
