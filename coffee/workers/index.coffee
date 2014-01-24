queue = require '../drivers/queue'
mongo = require '../drivers/mongo'

exports.initialize = (workers_initialized = ->) ->


  workers_initialized()