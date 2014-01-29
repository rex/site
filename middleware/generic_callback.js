module.exports = function(req, res, next) {
  res.generic_callback = function(err, body) {
    if (err) {
      return res.send(500, err);
    } else {
      return res.json(body);
    }
  };
  return next();
};
