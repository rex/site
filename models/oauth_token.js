var OAuthTokenSchema, Schema, mongoose;

mongoose = require('mongoose');

Schema = mongoose.Schema;

OAuthTokenSchema = new Schema({
  service: {
    type: String,
    required: true,
    index: true
  },
  auth_code: {
    type: String
  },
  api_key: {
    type: String
  },
  api_secret: {
    type: String
  },
  client_id: {
    type: String
  },
  client_secret: {
    type: String
  },
  access_token: {
    type: String
  },
  created_on: {
    type: Date,
    "default": Date.now
  },
  active: {
    type: Boolean,
    "default": true
  },
  meta: {
    type: Object
  }
});

module.exports = OAuthTokenSchema;
