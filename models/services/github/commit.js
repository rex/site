var CommitSchema, Plugins, Schema, model_config;

Schema = require('../../../drivers/mongo').Schema;

Plugins = require('../../plugins');

model_config = {
  redis_prefix: 'service:github:commit',
  model_name: 'github_commit'
};

CommitSchema = new Schema({
  commit_id: {
    type: String,
    index: true
  },
  repo: {
    type: Schema.Types.ObjectId,
    ref: 'github_repo',
    index: true
  },
  push: {
    type: Schema.Types.ObjectId,
    ref: 'github_push',
    index: true
  },
  message: String,
  created_on: {
    type: Date,
    index: true
  },
  url: String,
  author: {},
  committer: {},
  added: [
    {
      type: String
    }
  ],
  removed: [
    {
      type: String
    }
  ],
  modified: [
    {
      type: String
    }
  ]
});

CommitSchema.plugin(Plugins.config, model_config);

CommitSchema.plugin(Plugins.redis, model_config);

CommitSchema["static"]('createFromGithubCommit', function(commit, callback) {
  var new_commit;
  if (callback == null) {
    callback = function() {};
  }
  new_commit = new this();
  new_commit.set(commit);
  new_commit.set({
    commit_id: commit.id
  });
  return new_commit.save(function(err) {
    return callback(err, new_commit);
  });
});

module.exports = {
  schema: CommitSchema,
  redis_prefix: model_config.redis_prefix,
  model_name: model_config.model_name
};
