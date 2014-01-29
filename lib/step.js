var Step, colors, config, util;

util = require('util');

config = require('../config');

colors = config.colors;

Step = (function() {
  function Step() {
    this.prefix = " > ";
    this.red = colors.red;
    this.green = colors.green;
    this.reset = colors.reset;
  }

  Step.prototype.start_major = function(message) {
    return this.start(message, true);
  };

  Step.prototype.complete_major = function() {
    return this.complete(true);
  };

  Step.prototype.start = function(message, force) {
    if (force == null) {
      force = false;
    }
    return this.write("" + this.prefix + message + "...", force);
  };

  Step.prototype.group = function(name, force) {
    if (force == null) {
      force = false;
    }
    return this.write("\n\n [ " + name + " ] \n\n", force);
  };

  Step.prototype.groupEnd = function(force) {
    if (force == null) {
      force = false;
    }
    return this.write("\n [ /group ] \n\n", force);
  };

  Step.prototype.complete = function(force) {
    if (force == null) {
      force = false;
    }
    return this.write("" + this.green + "OK" + this.reset + "\n", force);
  };

  Step.prototype.error = function(err) {
    this.write("" + this.red + "ERROR" + this.reset + "\n");
    return console.error(err);
  };

  Step.prototype.write = function(text, force) {
    return (force || config.debug) && util.print(text);
  };

  return Step;

})();

module.exports = new Step;
