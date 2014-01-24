instagram = require 'instagram-node-lib'

instagram.set 'client_id', process.env.INSTAGRAM_CLIENT_ID
instagram.set 'client_secret', process.env.INSTAGRAM_CLIENT_SECRET
instagram.set 'access_token', process.env.INSTAGRAM_ACCESS_TOKEN

module.exports = instagram