logger = require './logger'
_ = require 'lodash'

# Here we adhere to the single responsibility principle
# and separate our mixins into separate files.

_ = require('./mixins/date') _
_ = require('./mixins/logging') _
_ = require('./mixins/git') _

module.exports = _