import React, { Component, PropTypes } from 'react'

import Toast from './Toast'
import UpperLeftUI from './UpperLeftUI'
import UpperRightUI from './UpperRightUI'

class App extends Component {
  static propTypes = {
    children: PropTypes.object,
    toast: PropTypes.string,
    unreadNotificationsCount: PropTypes.number,
    location: PropTypes.object
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
    const { children, toast, currentUser, unreadNotificationsCount } = this.props
    return <div className="wrapper" id="wrapper">
      <UpperLeftUI currentUser={currentUser} />
      <UpperRightUI currentUser={currentUser} unreadNotificationsCount={unreadNotificationsCount} />
      <Toast message={toast} />
      {currentUser && <a className='feedback-icon' target='_blank' href='https://hylo.com/c/metamaps'></a>}
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
