import React, { PropTypes, Component } from 'react'
import Unread from './Unread'
import Participant from './Participant'
import Message from './Message'

class MapChat extends Component {
  constructor(props) {
    super(props)

    this.state = {
      unreadMessages: 0,
      open: false,
      messageText: '',
      alertSound: true, // whether to play sounds on arrival of new messages or not
      cursorsShowing: true,
      videosShowing:  true
    }
  }

  close = () => {
    this.setState({open: false})
    this.props.onClose()
  }

  open = () => {
    this.setState({open: true, unreadMessages: 0})
    this.props.onOpen()
  }

  newMessage = () => {
    if (!this.state.open) this.setState({ unreadMessages: this.state.unreadMessages + 1 })
  }

  toggleDrawer = () => {
    if (this.state.open) this.close()
    else if (!this.state.open) this.open()
  }

  toggleAlertSound = () => {
    this.setState({alertSound: !this.state.alertSound})
    this.props.soundToggleClick()
  }

  toggleCursorsShowing = () => {
    this.setState({cursorsShowing: !this.state.cursorsShowing})
    this.props.cursorToggleClick()
  }

  toggleVideosShowing = () => {
    this.setState({videosShowing: !this.state.videosShowing})
    this.props.videoToggleClick()
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
    const rightOffset = this.state.open ? '0' : '-300px'
    const { videosShowing, cursorsShowing, alertSound, unreadMessages } = this.state
    return (
      <div className="chat-box"
        style={{ right: rightOffset }}
      >
        <div className="junto-header">
          PARTICIPANTS
          <div onClick={this.toggleVideosShowing} className={`video-toggle ${videosShowing ? '' : 'active'}`} />
          <div onClick={this.toggleCursorsShowing} className={`cursor-toggle ${cursorsShowing ? '' : 'active'}`} />
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
          <div onClick={this.toggleAlertSound} className={`sound-toggle ${alertSound ? '' : 'active'}`}></div>
        </div>
        <div className="chat-button" onClick={this.toggleDrawer}>
          <div className="tooltips">Chat</div>
          <Unread count={unreadMessages} />
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
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  leaveCall: PropTypes.func,
  joinCall: PropTypes.func,
  videoToggleClick: PropTypes.func,
  cursorToggleClick: PropTypes.func,
  soundToggleClick: PropTypes.func, 
  participants: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string, // css color
    id: PropTypes.number,
    image: PropTypes.string, // image url
    self: PropTypes.bool,
    username: PropTypes.string
  }))
}

export default MapChat
