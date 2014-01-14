var logger, _;

logger = require('./logger');

_ = require('underscore');

_ = require('./mixins/date')(_);

_ = require('./mixins/logging')(_);

_ = require('./mixins/git')(_);

module.exports = _;
