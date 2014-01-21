var instagram;

instagram = require('instagram-node-lib');

instagram.set('access_token', process.env.INSTAGRAM_ACCESS_TOKEN);

module.exports = instagram;
