import React, { PropTypes, Component } from 'react'

class Participant extends Component {
  render() {
    const { conversationLive, mapperIsLive, isParticipating, isPending, id, self, image, username, selfName, color } = this.props
    return (
			<div className={`participant participant-${id} ${self ? 'is-self' : ''}`}>
				<div className="chat-participant-image">
					<img src={image} style={{ border: `2px solid ${color}`}} />
				</div>
				<div className="chat-participant-name">
					{username} {self ? '(me)' : ''}
				</div>
				{!self && !conversationLive && <button
					className='button chat-participant-invite-call'
					onClick={this.props.inviteACall} // Realtime.inviteACall(id)
				/>}
				{!self && mapperIsLive && !isParticipating && <button
					className="button chat-participant-invite-join"
					onClick={this.props.inviteToJoin} // Realtime.inviteToJoin(id)
				/>}
				{isParticipating && <span className="chat-participant-participating">
					<div className="green-dot"></div>
				</span>}
				<div className="clearfloat"></div>
			</div>
    )
  }
}

Participant.propTypes = {
  conversationLive: PropTypes.bool,
  mapperIsLive: PropTypes.bool,
  isParticipating: PropTypes.bool,
  isPending: PropTypes.bool,
  color: PropTypes.string, // css color
  id: PropTypes.number,
  image: PropTypes.string, // image url
  self: PropTypes.bool,
  username: PropTypes.string
}

export default Participant
