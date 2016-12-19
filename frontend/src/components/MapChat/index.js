import React, { PropTypes, Component } from 'react'
import Unread from './Unread'
import Participant from './Participant'
import Message from './Message'

class MapChat extends Component {
  constructor(props) {
    super(props)

    this.state = {
      messageText: ''
    }
  }

  handleChange = key => e => {
    this.setState({
      [key]: e.target.value
    })
  }

  handleTextareaKeyUp = e => {
    if (e.which === 13) {
      e.preventDefault()
      const text = this.state.messageText
      this.props.handleInputMessage(text)
      this.setState({ messageText: '' })
    }
  }

  render = () => {
    const rightOffset = this.props.isOpen ? '-300px' : '0'
    const { videosShowing, cursorsShowing, alertSound } = this.props
    return (
      <div className="chat-box"
        style={{ right: rightOffset }}
      >
        <div className="junto-header">
          PARTICIPANTS
          <div className={`video-toggle ${videosShowing ? 'active' : ''}`} />
          <div className={`cursor-toggle ${cursorsShowing ? 'active' : ''}`} />
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
          {this.props.participants.map(participant => {
            return <Participant key={participant.id} {...participant} />
          })}
        </div>
        <div className="chat-header">
          CHAT
          <div className={`sound-toggle ${alertSound ? 'active' : ''}`}></div>
        </div>
        <div className="chat-button">
          <div className="tooltips">Chat</div>
          <Unread count={this.props.unreadMessages} />
        </div>
        <div className="chat-messages">
          {this.props.messages.map(message => {
            return <Message key={message.id} {...message} />
          })}
        </div>
        <textarea className="chat-input"
          placeholder="Send a message..."
          value={this.state.messageText}
          onChange={this.handleChange('messageText')}
          onKeyUp={this.handleTextareaKeyUp}
          onFocus={this.props.inputFocus}
          onBlur={this.props.inputBlur}
        />
      </div>
    )
  }
}

MapChat.propTypes = {
  isOpen: PropTypes.bool,
  leaveCall: PropTypes.func,
  joinCall: PropTypes.func,
  participants: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string, // css color
    id: PropTypes.number,
    image: PropTypes.string, // image url
    self: PropTypes.bool,
    username: PropTypes.string
  }))
}

export default MapChat
