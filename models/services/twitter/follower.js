var NewSchema, Plugins, Schema, model_config, _;

Schema = require('../../../drivers/mongo').Schema;

_ = require('../../../lib/_');

Plugins = require('../../plugins');

model_config = {
  redis_prefix: 'service:twitter:follower',
  model_name: 'twitter_follower'
};

NewSchema = new Schema({
  user_id: {
    type: Number
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'twitter_user'
  },
  created_on: {
    type: Date
  }
});

NewSchema.plugin(Plugins.config, model_config);

NewSchema.plugin(Plugins.redis, model_config);

NewSchema["static"]('createFrom', function(model, callback) {
  var new_item;
  if (callback == null) {
    callback = function() {};
  }
  new_item = new this();
  new_item.set({
    user_id: model.id,
    created_on: Date.now()
  });
  return new_item.save(function(err) {
    return callback(err, new_item);
  });
});

module.exports = {
  schema: NewSchema,
  redis_prefix: model_config.redis_prefix,
  model_name: model_config.model_name
};
