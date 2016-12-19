import React from 'react'

const Unread = props => {
  if (props.count <= 0) {
    return null
  }
  return <div className="chat-unread"></div>
}

export default Unread
