var Plugins, RepoSchema, Schema, model_config;

Schema = require('../../../drivers/mongo').Schema;

Plugins = require('../../plugins');

model_config = {
  redis_prefix: 'service:github:repo',
  model_name: 'github_repo'
};

RepoSchema = new Schema({
  personal: {
    type: Boolean,
    index: true
  },
  repo_id: {
    type: Number,
    index: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'github_user',
    index: true
  },
  owner_id: {
    type: Number,
    index: true
  },
  owner_username: String,
  name: String,
  full_name: String,
  "private": Boolean,
  fork: Boolean,
  html_url: String,
  description: String,
  homepage: String,
  size: Number,
  stargazers_count: Number,
  watchers_count: Number,
  language: String,
  has_issues: Boolean,
  has_downloads: Boolean,
  has_wiki: Boolean,
  forks_count: Number,
  open_issues_count: Number,
  watchers: Number,
  created_on: {
    type: Date,
    index: true
  },
  updated_on: {
    type: Date,
    index: true
  }
});

RepoSchema.plugin(Plugins.config, model_config);

RepoSchema.plugin(Plugins.redis, model_config);

RepoSchema["static"]('createFromGithubRepo', function(repo, callback) {
  var new_repo;
  if (callback == null) {
    callback = function() {};
  }
  new_repo = new this();
  new_repo.set(repo);
  new_repo.set({
    repo_id: repo.id,
    owner_id: repo.owner.id,
    owner_username: repo.owner.login
  });
  return new_repo.save(function(err) {
    return callback(err, new_repo);
  });
});

module.exports = {
  schema: RepoSchema,
  redis_prefix: model_config.redis_prefix,
  model_name: model_config.model_name
};
