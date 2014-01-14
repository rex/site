module.exports = function(_) {
  _.mixin({
    sha_stub: function(sha_hash) {
      return sha_hash.substring(0, 6);
    }
  });
  return _;
};
