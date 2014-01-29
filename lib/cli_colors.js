var DemoLine, ShowCLIColors, colors, _;

colors = require('../config').colors;

_ = require('./_');

DemoLine = "Grumpy wizards make toxic brew for the evil queen and jack.";

ShowCLIColors = function() {
  return _.each(colors, function(color, name) {
    if (name === 'reset') {
      return;
    }
    return console.log("" + color + (name.toUpperCase()) + " - " + DemoLine + " " + colors.reset);
  });
};

module.exports = ShowCLIColors;
