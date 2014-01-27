<div class="event">
  <div class="label">
    <i class="circular github icon">
  </div>

  <div class="content">
    <div class="date">
      {{age item.created_on}}
    </div>

    <div class="summary">
      {{me}} pushed {{item.params.payload.commits.length}} commits to GitHub
      {{#each items.params.payload.commits}}
        <div class="extra">
          <a href="{{commit.url}}">{{commit.sha}}</a>
          - {{commit.message}}
        </div>
      {{/each}}
    </div>
  </div>
</div>