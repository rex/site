var PostSchema, Schema, Tag, mongoose;

mongoose = require('mongoose');

Schema = mongoose.Schema;

Tag = require('./tag');

PostSchema = new Schema({
  created_on: {
    type: Date,
    index: true
  },
  last_updated: {
    type: Date,
    "default": Date.now,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      index: true
    }
  ],
  history: [
    {
      created_on: {
        type: Date
      },
      version: {
        type: Number,
        index: true
      },
      content: {
        type: String,
        "default": ''
      }
    }
  ]
});

module.exports = PostSchema;
