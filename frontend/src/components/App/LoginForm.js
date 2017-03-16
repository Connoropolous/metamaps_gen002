import React, { Component, PropTypes } from 'react'

class LoginForm extends Component {
  static propTypes = {
    loginFormAuthToken: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = { token: '' }
  }

  componentDidMount() {
    const token = document.head.getElementsByTagName('meta')['csrf-token'].content
    this.setState({token})
  }

  render () {
    return <form className="loginAnywhere" id="new_user" action="/login" acceptCharset="UTF-8" method="post">
      <input name="utf8" type="hidden" value="✓" />
      <input type="hidden" name="authenticity_token" value={this.state.token} />
      <div className="accountImage"></div>
      <div className="accountInput accountEmail">
        <input placeholder="Email" type="email" name="user[email]" id="user_email" />
      </div>
      <div className="accountInput accountPassword">
        <input placeholder="Password" type="password" name="user[password]" id="user_password" />
      </div>
      <div className="accountSubmit">
        <input type="submit" name="commit" value="SIGN IN" />
      </div>
      <div className="accountRememberMe">
        <label htmlFor="user_remember_me">Stay signed in</label>
        <input name="user[remember_me]" type="hidden" value="0" />
        <input type="checkbox" value="1" name="user[remember_me]" id="user_remember_me" />
        <div className="clearfloat"></div>
      </div>
      <div className="clearfloat"></div>
      <div className="accountForgotPass">
          <a href="/users/password/new">Forgot password?</a>
      </div>
    </form>
  }
}

export default LoginForm
