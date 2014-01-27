@Routers.Index = Backbone.Router.extend
  initialize: ->

  routes:
    "(/)": "index"

  index: ->
    $("#main-content").html Handlebars.templates['login/index']()