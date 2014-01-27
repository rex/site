var Models, config, logger, mongo, request;

config = require('../../config');

logger = require('../../lib/logger');

request = require('request');

mongo = require("../../drivers/mongo");

Models = {
  OAuth_Token: mongo.model('oauth_token')
};

module.exports = function(app) {
  app.get('/oauth', function(req, res) {
    return res.render('oauth/index', {
      config: config
    });
  });
  return app.get('/oauth/redirect/instagram', function(req, res) {
    if (req.query.error) {
      return res.render('oauth/authorize', {
        service: 'instagram',
        error_reason: req.query.error_reason,
        error: req.query.error,
        error_description: req.query.error_description
      });
    } else if (req.query.code) {
      return request.post({
        url: 'https://api.instagram.com/oauth/access_token',
        form: {
          client_id: config.instagram.client_id,
          client_secret: config.instagram.client_secret,
          redirect_uri: config.instagram.oauth_redirect_uri,
          grant_type: 'authorization_code',
          code: req.query.code
        }
      }, function(err, resp, body) {
        if (resp.statusCode === 400) {
          logger("Status code 400!", body.error_reason, body.error_message);
          return res.render('oauth/authorize', {
            service: 'instagram',
            error_reason: body.error_reason,
            error: body.error_reason,
            error_description: body.error_message
          });
        }
        body = JSON.parse(body);
        return Models.OAuth_Token.findOneAndUpdate({
          service: 'instagram'
        }, {
          $set: {
            access_token: body.access_token,
            meta: {
              user: body.user
            }
          }
        }, {
          upsert: true
        }, function(err, token) {
          var page_data;
          console.log("Token created/updated", token);
          if (err) {
            logger.error(err);
            return res.send(500, err);
          } else {
            page_data = {
              service: 'instagram',
              success: true,
              access_token: body.access_token,
              meta: {
                user: body.user
              }
            };
            return res.render('oauth/authorize', page_data);
          }
        });
      });
    }
  });
};
