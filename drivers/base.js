var BaseDriver;

BaseDriver = (function() {
  function BaseDriver() {}

  BaseDriver.client = {};

  BaseDriver.prototype.intitialize = function(callback) {
    throw new Error("This method must be overriden by the driver.");
  };

  return BaseDriver;

})();

module.exports = BaseDriver;
