config = require '../../config'
logger = require '../../lib/logger'
request = require 'request'
mongoose = require 'mongoose'

OAuth_Token = mongoose.model 'oauth_token'

module.exports = (app) ->
  app.get '/oauth', (req, res) ->
    res.render 'oauth/index',
      config: config

  app.get '/oauth/redirect/instagram', (req, res) ->
    if req.query.error
      res.render 'oauth/authorize',
        service: 'instagram'
        error_reason: req.query.error_reason
        error: req.query.error
        error_description: req.query.error_description
    else if req.query.code
      request.post
        url: 'https://api.instagram.com/oauth/access_token'
        json:
          client_id: config.instagram.client_id
          client_secret: config.instagram.client_secret
          redirect_uri: config.instagram.oauth_redirect_uri
          grant_type: 'authorization_code'
          code: req.query.code
      , (err, resp, body) ->
        if resp.statusCode is 400 then return res.render 'oauth/authorize',
          service: 'instagram'
          error_reason: body.error_reason
          error: body.error_reason
          error_description: body.error_message

        Token = new OAuth_Token
        Token.set
          service: 'instagram'
          access_token: body.access_token
          meta:
            user: body.user
        Token.save (err) ->
          logger "Token saved!", Token.toJSON(), body
          if err
            logger.error err
            res.send 500, err
          else
            page_data =
              service: 'instagram'
              success: true
              access_token: body.access_token
              meta:
                user: body.user

            logger "Page Data", page_data

            res.render 'oauth/authorize', page_data
