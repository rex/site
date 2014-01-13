var instagram;

instagram = require('instagram-node-lib');

instagram.set('client_id', process.env.INSTAGRAM_CLIENT);

instagram.set('client_secret', process.env.INSTAGRAM_SECRET);

module.exports = instagram;
