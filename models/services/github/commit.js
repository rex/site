var CommitSchema, Plugins, Schema, model_config, _;

Schema = require('../../../drivers/mongo').Schema;

_ = require('../../../lib/_');

Plugins = require('../../plugins');

model_config = {
  redis_prefix: 'service:github:commit',
  model_name: 'github_commit'
};

CommitSchema = new Schema({
  sha: {
    type: String
  },
  repo: {
    type: Schema.Types.ObjectId,
    ref: 'github_repo'
  },
  repo_id: {
    type: Number
  },
  push: {
    type: Schema.Types.ObjectId,
    ref: 'github_push'
  },
  message: {
    type: String
  },
  created_on: {
    type: Date
  },
  url: {
    type: String
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'github_user'
  },
  author_id: {
    type: Number
  },
  committer: {
    type: Schema.Types.ObjectId,
    ref: 'github_user'
  },
  committer_id: {
    type: Number
  },
  stats: {
    total: {
      type: Number
    },
    additions: {
      type: Number
    },
    deletions: {
      type: Number
    }
  },
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
  ],
  renamed: [
    {
      type: String
    }
  ]
});

CommitSchema.plugin(Plugins.config, model_config);

CommitSchema.plugin(Plugins.redis, model_config);

CommitSchema["static"]('createFromGithubCommit', function(commit, callback) {
  var files, new_commit;
  if (callback == null) {
    callback = function() {};
  }
  new_commit = new this();
  files = _.groupBy(commit.files, function(file) {
    return file.status;
  });
  new_commit.set({
    sha: commit.sha,
    message: commit.commit.message,
    url: commit.url,
    stats: commit.stats,
    commit_id: commit.id,
    author_id: commit.author.id,
    committer_id: commit.committer.id,
    added: files.added,
    removed: files.removed,
    modified: files.modified,
    renamed: files.renamed
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
