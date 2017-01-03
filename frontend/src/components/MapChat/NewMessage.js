import React, { PropTypes, Component } from 'react'
import { Picker } from 'emoji-mart'

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

  render = () => {
    return (
      <div className="new-message-area">
        <span onClick={this.toggleEmojiPicker}>Emoji</span>
        <Picker set='emojione' style={{ display: this.state.showEmojiPicker ? 'block' : 'none' }} />
        <textarea {...this.props.textAreaProps} />
      </div>
    )
  }
}

NewMessage.propTypes = {
  textAreaProps: PropTypes.shape({
    className: PropTypes.string,
    ref: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onKeyUp: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func
  })
}

export default NewMessage
