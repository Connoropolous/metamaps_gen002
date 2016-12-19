import React from 'react'

const Message = props => {
  const { user_image, user_name, message, timestamp } = props
  return (
    <div className="chat-message">
      <div className="chat-message-user">
        <img src={user_image} title={user_name} />
      </div>
      <div className="chat-message-text">{message}</div>
      <div className="chat-message-time">{timestamp}</div>
      <div className="clearfloat"></div>
    </div>
  )
}

export default Message
