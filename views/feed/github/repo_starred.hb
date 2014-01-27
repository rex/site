<div class="event">
  <div class="label">
    <i class="circular github icon">
  </div>

  <div class="content">
    <div class="date">
      {{age item.created_on}}
    </div>

    <div class="summary">
      {{me}} starred a repository:
      <a href="https://github.com/{{item.params.repo.name}}">
        {{item.params.repo.name}}
      </a>
    </div>
  </div>
</div>