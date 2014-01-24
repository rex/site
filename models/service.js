var Schema, ServiceSchema, mongoose;

mongoose = require('mongoose');

Schema = mongoose.Schema;

ServiceSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  }
});
