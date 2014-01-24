util = require 'util'

class Step
  constructor: ->
    @prefix = " > "
    @red = `'\033[0;31m'`
    @green = `'\033[0;32m'`
    @reset = `'\033[0m'`

  start: (message) ->
    util.print "#{@prefix}#{message}..."

  complete: ->
    util.print "#{@green}OK#{@reset}\n"

  error: (err) ->
    util.print "#{@red}ERROR#{@reset}\n"
    console.error err

module.exports = new Step