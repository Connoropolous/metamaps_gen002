import React, { Component, PropTypes } from 'react'

class AccountMenu extends Component {
  static propTypes = {
    currentUser: PropTypes.object
  }

  render () {
    return <div>
      <img className="sidebarAccountImage" src="https://metamaps-live.s3.amazonaws.com/users/images/555/629/996/sixtyfour/11835c3.png?1417298429" alt="11835c3" width="48" height="48" />
      <h3 className="accountHeader">Connor</h3>
      <ul>
        <li className="accountListItem accountSettings">
          <div className="accountIcon"></div>
          <a href="https://metamaps.cc/users/555629996/edit">Settings</a>
        </li>
        <li className="accountListItem accountAdmin">
          <div className="accountIcon"></div>
          <a href="/metacodes">Admin</a>
        </li>
        <li className="accountListItem accountApps">
          <div className="accountIcon"></div>
          <a href="/oauth/authorized_applications">Apps</a>
        </li>
        <li className="accountListItem accountInvite openLightbox" data-open="invite">
          <div className="accountIcon"></div>
          <span>Share Invite</span>
        </li>
        <li className="accountListItem accountLogout">
          <div className="accountIcon"></div>
          <a id="Logout" href="/logout">Sign Out</a>
        </li>
      </ul>
    </div>
  }
}

export default AccountMenu
