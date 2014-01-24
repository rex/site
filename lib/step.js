var Step, util;

util = require('util');

Step = (function() {
  function Step() {
    this.prefix = " > ";
    this.red = '\033[0;31m';
    this.green = '\033[0;32m';
    this.reset = '\033[0m';
  }

  Step.prototype.start = function(message) {
    return util.print("" + this.prefix + message + "...");
  };

  Step.prototype.complete = function() {
    return util.print("" + this.green + "OK" + this.reset + "\n");
  };

  Step.prototype.error = function(err) {
    util.print("" + this.red + "ERROR" + this.reset + "\n");
    return console.error(err);
  };

  return Step;

})();

module.exports = new Step;
