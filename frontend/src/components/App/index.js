import React, { Component, PropTypes } from 'react'

import MobileHeader from './MobileHeader'
import UpperLeftUI from './UpperLeftUI'
import UpperRightUI from './UpperRightUI'

class App extends Component {
  static propTypes = {
    children: PropTypes.object,
    toast: PropTypes.string,
    unreadNotificationsCount: PropTypes.number,
    location: PropTypes.object,
    mobile: PropTypes.bool,
    mobileTitle: PropTypes.string,
    mobileTitleWidth: PropTypes.number,
    mobileTitleClick: PropTypes.func,
    openInviteLightbox: PropTypes.func,
    toggleAccountBox: PropTypes.func,
    map: PropTypes.object,
    userRequested: PropTypes.bool,
    requestAnswered: PropTypes.bool,
    requestApproved: PropTypes.bool,
    onRequestAccess: PropTypes.func
  }

  static childContextTypes = {
    currentUser: PropTypes.object,
    location: PropTypes.object
  }

  getChildContext () {
    const { route, location } = this.props
    return {currentUser: route.currentUser, location}
  }

  render () {
    const { children, toast, currentUser, unreadNotificationsCount, openInviteLightbox,
            mobile, mobileTitle, mobileTitleWidth, mobileTitleClick, location,
            toggleAccountBox, map, userRequested, requestAnswered, requestApproved,
            onRequestAccess } = this.props
    const { pathname } = location || {}
    const unauthedHome = pathname === '/' && !currentUser
    return <div className="wrapper" id="wrapper">
      {mobile && <MobileHeader currentUser={currentUser}
                               unreadNotificationsCount={unreadNotificationsCount}
                               mobileTitle={mobileTitle}
                               mobileTitleWidth={mobileTitleWidth}
                               onTitleClick={mobileTitleClick} />}
      {!unauthedHome && <UpperLeftUI currentUser={currentUser}
                                     map={map}
                                     userRequested={userRequested}
                                     requestAnswered={requestAnswered}
                                     requestApproved={requestApproved}
                                     onRequestClick={onRequestAccess} />}
      {!mobile && <UpperRightUI currentUser={currentUser}
                                unreadNotificationsCount={unreadNotificationsCount}
                                openInviteLightbox={openInviteLightbox}
                                signInPage={pathname === '/login'}
                                onClickAccount={toggleAccountBox} />}
      {!mobile && currentUser && <a className='feedback-icon' target='_blank' href='https://hylo.com/c/metamaps'></a>}
      {children}
    </div>
  }
}

export default App

/*
<% classes = action_name == "home" ? "homePage" : ""
   classes += action_name == "home" && authenticated? ? " explorePage" : ""
   classes += controller_name == "maps" && action_name == "index" ? " explorePage" : ""
   if controller_name == "maps" && action_name == "show"
     classes += " mapPage"
     if policy(@map).update?
       classes += " canEditMap"
     end
     if @map.permission == "commons"
       classes += " commonsMap"
     end
   end
   classes += controller_name == "topics" && action_name == "show" ? " topicPage" : ""
   %>
*/
