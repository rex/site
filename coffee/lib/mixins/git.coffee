module.exports = (_) ->
  _.mixin
    sha_stub: (sha_hash) ->
      sha_hash.substring(0, 6)

  _