import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class UpperLeftUI extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    map: PropTypes.object,
    userRequested: PropTypes.bool,
    requestAnswered: PropTypes.bool,
    requestApproved: PropTypes.bool,
    onRequestClick: PropTypes.func
  }

  render () {
    const { map, currentUser, userRequested, requestAnswered, requestApproved, onRequestClick } = this.props
    return <div className="upperLeftUI">
      <div className="homeButton">
        {currentUser && <Link to="/">METAMAPS</Link>}
        {!currentUser && <a href="/">METAMAPS</a>}
      </div>
      <div className="sidebarSearch">
        <input type="text" className="sidebarSearchField" placeholder="Search for topics, maps, and mappers..." />
        <div id="searchLoading"></div>
        <div className="sidebarSearchIcon"></div>
        <div className="clearfloat"></div>
      </div>
      {map && !map.authorizeToEdit(currentUser) && <div className="viewOnly">
        <div className="eyeball">View Only</div>
        {currentUser && !userRequested && <div className="requestAccess requestNotice" onClick={onRequestClick}>Request Access</div>}
        {userRequested && !requestAnswered && <div className="requestPending requestNotice">Request Pending</div>}
        {userRequested && requestAnswered && !requestApproved && <div className="requestNotAccepted requestNotice">Request Not Accepted</div>}
      </div>}
      <div className="clearfloat"></div>
    </div>
  }
}

export default UpperLeftUI

/*

<% request = current_user && @map && @allrequests.find{|a| a.user == current_user}
   className = (@map and not policy(@map).update?) ? 'isViewOnly ' : ''
   if @map
     className += 'sendRequest' if not request
     className += 'sentRequest' if request and not request.answered
     className += 'requestDenied' if request and request.answered and not request.approved
   end %>

   */
