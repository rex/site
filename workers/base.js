var BaseWorker;

BaseWorker = (function() {
  function BaseWorker() {}

  BaseWorker.prototype.initialize = function(initialized) {
    if (initialized == null) {
      initialized = function() {};
    }
  };

  return BaseWorker;

})();

module.exports = BaseWorker;
