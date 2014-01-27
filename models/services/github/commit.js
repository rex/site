var CommitSchema, Redis, Schema;

Schema = require('../../../drivers/mongo').Schema;

Redis = require('../../../drivers/redis');

CommitSchema = new Schema({
  commit_id: {
    type: String,
    index: true
  },
  distinct: Boolean,
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

CommitSchema.post('save', function(commit) {
  return Redis.store_model("github_commit_" + commit._id, commit.toJSON());
});

CommitSchema.methods.fromGithubCommit = function(commit, callback) {
  this.set(commit);
  this.set({
    commit_id: commit.id
  });
  return this.save(function(err) {
    return callback(err);
  });
};

module.exports = CommitSchema;
