$ ->
  $('.ui.sidebar').sidebar('push page')

  $(document).pjax 'a', '#main-content'

  $('.menutoggle').hover ->
    $(this).stop().animate
      width: 160
    ,
      duration: 200
      complete: ->
        $(this).find('.text').show()
  , ->
    $(this).find('.text').hide()
    $(this).stop().animate
      duration: 200
      width: 60

  $('.menutoggle, .menuclose').click (e) ->
    e.preventDefault()
    $('.ui.sidebar').sidebar 'toggle', 'push page'