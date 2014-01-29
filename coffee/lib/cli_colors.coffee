colors = require('../config').colors
_ = require './_'
DemoLine = "Grumpy wizards make toxic brew for the evil queen and jack."

ShowCLIColors = ->
  _.each colors, (color, name) ->
    if name is 'reset' then return

    console.log "#{color}#{name.toUpperCase()} - #{DemoLine} #{colors.reset}"

module.exports = ShowCLIColors