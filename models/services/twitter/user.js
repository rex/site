var NewSchema, Plugins, Schema, model_config, _;

Schema = require('../../../drivers/mongo').Schema;

_ = require('../../../lib/_');

Plugins = require('../../plugins');

model_config = {
  redis_prefix: 'service:twitter:user',
  model_name: 'twitter_user'
};

NewSchema = new Schema({
  user_id: {
    type: Number
  },
  name: {
    type: String
  },
  handle: {
    type: String
  },
  location: {
    type: String
  },
  description: {
    type: String
  },
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
  "protected": {
    type: Boolean
  },
  followers_count: {
    type: Number
  },
  following_count: {
    type: Number
  },
  listed_count: {
    type: Number
  },
  favorites_count: {
    type: Number
  },
  verified: {
    type: Boolean
  },
  tweet_count: {
    type: Number
  },
  images: {
    background: {
      type: String
    },
    profile: {
      type: String
    }
  },
  colors: {
    background: {
      type: String
    },
    link: {
      type: String
    },
    sidebar: {
      border: {
        type: String
      },
      fill: {
        type: String
      }
    },
    text: {
      type: String
    }
  },
  followers: [
    {
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
    }
  ],
  following: [
    {
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
    }
  ],
  signed_up_on: {
    type: Date
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

NewSchema["static"]('createFromTwitterUser', function(model, callback) {
  var new_item, urls;
  if (callback == null) {
    callback = function() {};
  }
  new_item = new this();
  urls = [];
  if (model.entities) {
    _.each(model.entities, function(entity) {
      if (entity.urls) {
        return urls = _.map(entity.urls, function(url) {
          return {
            href: url.url,
            link: url.expanded_url,
            display: url.display_url
          };
        });
      }
    });
  }
  new_item.set({
    user_id: model.id,
    name: model.name,
    handle: model.screen_name,
    location: model.location,
    description: model.description,
    urls: urls,
    "protected": model["protected"],
    followers_count: model.followers_count,
    following_count: model.friends_count,
    listed_count: model.listed_count,
    favorites_count: model.favorites_count,
    verified: model.verified,
    tweet_count: model.statuses_count,
    images: {
      background: model.profile_background_image_url_https,
      profile: model.profile_image_url_https
    },
    colors: {
      background: model.profile_background_color,
      links: model.profile_link_color,
      text: model.profile_text_color,
      sidebar: {
        border: model.profile_sidebar_border_color,
        fill: model.profile_sidebar_fill_color
      }
    },
    followers: [],
    following: [],
    twitter_created_on: model.created_at,
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
