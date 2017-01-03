import React, { PropTypes, Component } from 'react'
import { Picker, emojiIndex } from 'emoji-mart'
import { escapeRegExp } from 'lodash'

class NewMessage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      //showEmojiPicker: false
      showEmojiPicker: true
    }
  }

  toggleEmojiPicker = () => {
    this.setState({ showEmojiPicker: !this.state.showEmojiPicker })
  }

  textAreaValue = () => {
    let { messageText } = this.props
    Object.keys(emojiIndex.emoticons).forEach(key => {
      const value = emojiIndex.emoticons[key]
      messageText = messageText.replace(new RegExp(escapeRegExp(key), 'g'), `:${value}:`)
    })
    Object.keys(emojiIndex.emojis).forEach(key => {
      const emoji = emojiIndex.emojis[key]
      messageText = messageText.replace(new RegExp(escapeRegExp(emoji.colons), 'g'), emoji.native)
    })
    return messageText
  }

  handleClick = (emoji, event) => {
    const { messageText } = this.props
    this.props.handleChange({ target: {
      value: messageText + emoji.colons
    }})
  }

  render = () => {
    return (
      <div className="new-message-area">
        <span onClick={this.toggleEmojiPicker}>Emoji</span>
        <Picker set='emojione'
          onClick={this.handleClick}
          style={{
            display: this.state.showEmojiPicker ? 'block' : 'none',
            width: '100%'
          }}
        />
        <textarea value={this.textAreaValue()}
          onChange={this.props.handleChange}
          {...this.props.textAreaProps}
        />
      </div>
    )
  }
}

NewMessage.propTypes = {
  messageText: PropTypes.string,
  handleChange: PropTypes.func,
  textAreaProps: PropTypes.shape({
    className: PropTypes.string,
    ref: PropTypes.func,
    placeholder: PropTypes.string,
    onKeyUp: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func
  })
}

export default NewMessage
