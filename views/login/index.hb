<div class="ui three column grid">
  <div class="column"></div>
  <div class="column">
    <div class="ui form segment">
      <div class="field">
        <label>Username</label>
        <div class="ui left labeled icon input">
          <input type="text" placeholder="Username" id="login_username" />
          <i class="user icon"></i>
          <div class="ui corner label">
            <i class="icon asterisk"></i>
          </div>
        </div>
      </div>

      <div class="field">
        <label>Password</label>
        <div class="ui left labeled icon input">
          <input type="password" id="login_password" />
          <i class="lock icon"></i>
          <div class="ui corner label">
            <i class="icon asterisk"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="ui error message hidden">
      <div class="header">There was an error logging in!</div>
    </div>

    <a class="ui blue submit button">Login</a>
  </div>
  <div class="column"></div>