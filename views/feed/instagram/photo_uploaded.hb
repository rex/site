<div class="event">
  <div class="label">
    <i class="circular instagram icon"></i>
  <div class="content">
    <div class="date">
      {{item.date}}
      {{!-- #{_.age(parseInt(item.date) * 1000 )} --}}
    <div class="summary">
      {{me}} uploaded a photo to Instagram
    </div>
    <div class="extra text">
      {{item.caption}}
    </div>
    <div class="extra images">
      <img src="{{item.image}}" />
    </div>
  </div>
</div>