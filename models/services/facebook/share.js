var NewSchema, Plugins, Schema, model_config, _;

Schema = require('../../../drivers/mongo').Schema;

_ = require('../../../lib/_');

Plugins = require('../../plugins');

model_config = {
  redis_prefix: 'service:facebook:share',
  model_name: 'facebook_share'
};

NewSchema = new Schema;

NewSchema.plugin(Plugins.config, model_config);

NewSchema.plugin(Plugins.redis, model_config);

NewSchema["static"]('createFrom', function(model, callback) {
  var new_item;
  if (callback == null) {
    callback = function() {};
  }
  new_item = new this();
  return new_item.save(function(err) {
    return callback(err, new_item);
  });
});

module.exports = {
  schema: NewSchema,
  redis_prefix: model_config.redis_prefix,
  model_name: model_config.model_name
};
