/* global $, embedly */
import React, { PropTypes, Component } from 'react'

import EmbedlyCard from './EmbedlyCard'

class Attachments extends Component {
  constructor(props) {
    super(props)

    this.state = {
      linkEdit: ''
    }
  }

  removeLink = () => {
    this.props.updateTopic({ link: null })
    $('.embedly-card').remove()
  }

  resetLink = () => {
    this.setState({ linkEdit: '' })
  }

  onLinkChangeHandler = e => {
    this.setState({ linkEdit: e.target.value })
  }

  onLinkKeyUpHandler = e => {
    const ENTER_KEY = 13
    if (e.which === ENTER_KEY) {
      const { linkEdit } = this.state
      this.setState({ linkEdit: '' })
      this.props.updateTopic({ link: linkEdit })
    }
  }

  render = () => {
    const { link, authorizedToEdit } = this.props
    const { linkEdit } = this.state
    const hasAttachment = !!link

    if (!hasAttachment && !authorizedToEdit) return null

    const className = hasAttachment ? 'embeds' : 'attachments'

    return (
      <div className={className}>
        <div className="addLink"
          style={{ display: hasAttachment ? 'none' : 'block' }}
        >
          <div id="addLinkIcon"></div>
          <div id="addLinkInput">
            <input ref={input => (this.linkInput = input)}
              placeholder="Enter or paste a link"
              value={linkEdit}
              onChange={this.onLinkChangeHandler}
              onKeyUp={this.onLinkKeyUpHandler}></input>
            {linkEdit && <div id="addLinkReset" onClick={this.resetLink}></div>}
          </div>
        </div>
        {link && <EmbedlyCard link={link} />}
        {authorizedToEdit && (
          <div id="linkremove"
            style={{ display: hasAttachment ? 'block' : 'none' }}
            onClick={this.removeLink}
          />
        )}
      </div>
    )
  }
}

Attachments.propTypes = {
  link: PropTypes.string,
  authorizedToEdit: PropTypes.bool,
  updateTopic: PropTypes.func
}

export default Attachments
