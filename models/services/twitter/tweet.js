var NewSchema, Plugins, Schema, model_config, _;

Schema = require('../../../drivers/mongo').Schema;

_ = require('../../../lib/_');

Plugins = require('../../plugins');

model_config = {
  redis_prefix: 'service:twitter:tweet',
  model_name: 'twitter_tweet'
};

NewSchema = new Schema({
  tweet_id: {
    type: Number
  },
  text: {
    type: String
  },
  source: {
    type: String
  },
  truncated: {
    type: Boolean
  },
  is_reply: {
    type: Boolean
  },
  is_reply_to: {
    handle: {
      type: String
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: 'twitter_tweet'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'twitter_user'
    }
  },
  media: [
    {
      type: Schema.Types.ObjectId,
      ref: 'twitter_media'
    }
  ],
  urls: [
    {
      href: {
        type: String
      },
      link: {
        type: String
      },
      display: {
        type: String
      }
    }
  ],
  mentions_me: {
    type: Boolean
  },
  mentions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'twitter_user'
    }
  ],
  hashtags: [
    {
      type: String
    }
  ],
  retweet_count: {
    type: Number
  },
  favorite_count: {
    type: Number
  },
  created_on: {
    type: Date
  },
  updated_on: {
    type: Date,
    "default": Date.now
  }
});

NewSchema.plugin(Plugins.config, model_config);

NewSchema.plugin(Plugins.redis, model_config);

NewSchema["static"]('createFromTwitterTweet', function(model, callback) {
  var hashtags, mentions, new_item, urls;
  if (callback == null) {
    callback = function() {};
  }
  new_item = new this();
  urls = [];
  mentions = [];
  hashtags = [];
  if (model.entities) {
    if (model.entities.urls) {
      urls = _.map(model.entities.urls, function(url) {
        return {
          href: url.url,
          link: url.expanded_url,
          display: url.display_url
        };
      });
    }
    if (model.entities.hashtags) {
      hashtags = _.pluck(model.entities.hashtags, 'text');
    }
  }
  new_item.set({
    tweet_id: model.id,
    text: model.text,
    source: model.source,
    truncated: model.truncated,
    is_reply: _.has(model, "in_reply_to_status_id"),
    is_reply_to: {
      handle: model.in_reply_to_screen_name
    },
    urls: urls,
    hashtags: hashtags,
    retweet_count: model.retweet_count,
    favorite_count: model.favorite_count,
    created_on: model.created_at
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
