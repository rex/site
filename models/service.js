var Schema, ServiceSchema;

Schema = require('mongoose').Schema;

ServiceSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  }
});
