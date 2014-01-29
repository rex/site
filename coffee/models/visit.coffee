Schema = require('../drivers/mongo').Schema
logger = require '../lib/logger'

Plugins = require './plugins'

model_config =
  redis_prefix: 'app:visit'
  model_name: 'visit'

VisitSchema = new Schema
  created_on:
    type: Date
    default: Date.now
    index: true
  ip:
    type: String
    default: ''
  path:
    type: String
    default: ''
    index: true
  xhr:
    type: Boolean
    default: false
  subdomains:
    type: Array
    default: []
  original_url:
    type: String
    default: ''
  protocol:
    type: String
    default: 'http'
  accepted_languages:
    type: Array
  accepted_charsets:
    type: Array
  params:
    type: Array
  body:
    type: Object
  query:
    type: Object
  pjax:
    type: Boolean
  content_type:
    type: String
  referer:
    type: String
  browser_info:
    type: Object

VisitSchema.plugin Plugins.config, model_config
# Not loading into Redis

VisitSchema.methods.createFromRequest = (req, res, done) ->
  self = this

  this.set 'ip', req.ip
  this.set 'path', req.path
  this.set 'xhr', req.xhr
  this.set 'subdomains', req.subdomains
  this.set 'original_url', req.originalUrl
  this.set 'protocol', req.protocol
  this.set 'accepted_languages', req.acceptedLanguages
  this.set 'accepted_charsets', req.acceptedCharsets
  this.set 'params', req.params
  this.set 'body', req.body
  this.set 'query', req.query
  this.set 'pjax', if req.headers['X-PJAX']? then true else false
  this.set 'content_type', req.get 'content-type'
  this.set 'referer', req.headers['referer']

  this.save (err) ->
    if err
      logger.error "Error saving visit:", err
    else
      req.visit_id = self._id
      res.locals.visit_id = self._id

    done()

module.exports =
  schema: VisitSchema
  redis_prefix: model_config.redis_prefix
  model_name: model_config.model_name