util = require 'util'
config = require '../config'
colors = config.colors

class Step
  constructor: ->
    @prefix = " > "
    @red = colors.red
    @green = colors.green
    @reset = colors.reset

  start_major: (message) ->
    @start message, true

  complete_major: ->
    @complete true

  start: (message, force = false) ->
    @write "#{@prefix}#{message}...", force

  group: (name, force = false) ->
    @write "\n\n [ #{name} ] \n\n", force

  groupEnd: (force = false) ->
    @write "\n [ /group ] \n\n", force

  complete: (force = false)->
    @write "#{@green}OK#{@reset}\n", force

  error: (err) ->
    @write "#{@red}ERROR#{@reset}\n"
    console.error err

  write: (text, force) ->
    (force or config.debug) and util.print text
    true

module.exports = new Step