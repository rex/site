class BaseDriver

  @client = {}

  intitialize: (callback) ->
    throw new Error "This method must be overriden by the driver."

module.exports = BaseDriver