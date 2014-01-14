module.exports = function(app) {
  require('./github')(app);
  require('./twitter')(app);
  return require('./instagram')(app);
};
