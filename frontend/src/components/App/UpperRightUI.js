import React, { Component, PropTypes } from 'react'

import FilterBox from './FilterBox'
import AccountMenu from './AccountMenu'
import LoginForm from './LoginForm'
import NotificationIcon from './NotificationIcon'

class UpperRightUI extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    signInPage: PropTypes.bool,
    unreadNotificationsCount: PropTypes.number
  }

  static contextTypes = {
    location: PropTypes.object
  }

  render () {
    const { currentUser, signInPage, unreadNotificationsCount } = this.props
    const { location } = this.context
    // TODO: get these map related things out of this file
    // TODO: only show 'import' if you have edit rights for the map
    const isMapPage = location.pathname.slice(0, 6) === '/maps/'
    return <div className="upperRightUI">
      {isMapPage && <div className="mapElement upperRightEl upperRightMapButtons">
        {currentUser && <div className="importDialog upperRightEl upperRightIcon mapElement openLightbox" data-open="import-dialog-lightbox">
          <div className="tooltipsUnder">
            Import Data
          </div>
        </div>}
        <div className="sidebarFilter upperRightEl">
          <div className="sidebarFilterIcon upperRightIcon"><div className="tooltipsUnder">Filter</div></div>
          <div className="sidebarFilterBox upperRightBox">
            <FilterBox />
          </div>
        </div>
        {currentUser && <div className="sidebarFork upperRightEl">
          <div className="sidebarForkIcon upperRightIcon"><div className="tooltipsUnder">Save To New Map</div></div>
        </div>}
        <div className="clearfloat"></div>
      </div>}
      {currentUser && <a href="/maps/new" target="_blank" className="addMap upperRightEl upperRightIcon">
        <div className="tooltipsUnder">
          Create New Map
        </div>
      </a>}
      {currentUser && <span id="notification_icon">
        <NotificationIcon unreadNotificationsCount={unreadNotificationsCount} />
      </span>}
      {!signInPage && <div className="sidebarAccount upperRightEl">
        <div className="sidebarAccountIcon"><div className="tooltipsUnder">Account</div>
          {currentUser && <img src={currentUser.get('image')} />}
          {!currentUser && 'SIGN IN'}
          {!currentUser && <div className="accountInnerArrow"></div>}
        </div>
        <div className="sidebarAccountBox upperRightBox">
          {currentUser ? <AccountMenu /> : <LoginForm />}
        </div>
      </div>}
      <div className="clearfloat"></div>
    </div>
  }
}

export default UpperRightUI
