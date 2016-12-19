import React, { PropTypes, Component } from 'react'

class MapChat extends Component {
  render() {
    const rightOffset = this.props.show ? '-300px' : '0'
    return (
      <div className="chat-box"
        style={{ right: rightOffset }}
      >
        <div className="junto-header">
          PARTICIPANTS
          <div className="video-toggle" />
          <div className="cursor-toggle" />
        </div>
        <div className="participants">
				  <div className="conversation-live">
						LIVE
						<span className="call-action leave" onClick={this.props.leaveCall}>
							LEAVE
						</span>
						<span className="call-action join"  onClick={this.props.joinCall}>
							JOIN
						</span>
					</div>
        </div>
        <div className="chat-header">
          CHAT
          <div className="sound-toggle"></div>
        </div>
        <div className="chat-button">
          <div className="tooltips">Chat</div>
          <div className="chat-unread"></div>
        </div>
        <div className="chat-messages"></div>
        <textarea className="chat-input" placeholder="Send a message..." />
      </div>
    )
  }
}

MapChat.propTypes = {
  show: PropTypes.bool,
  leaveCall: PropTypes.func,
  joinCall: PropTypes.func,
  participants: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string // css color
    id: PropTypes.number,
    image: PropTypes.string, // image url
    self: PropTypes.bool,
    username: PropTypes.string,
  }))
}

export default MapChat
