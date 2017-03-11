import React, { Component, PropTypes } from 'react'

class Toast extends Component {
  static propTypes = {
    message: PropTypes.string
  }

  render () {
    const html = {__html: this.props.html}
    return <p id="toast" className="toast" dangerouslySetInnerHTML={html} />
  }
}

export default Toast
