import React, { Component, PropTypes } from 'react'
import { RIETextArea } from 'riek'

class Title extends Component {
  nameCounterText() {
    // for some reason, there's an error if this isn't inside a function
    return `${this.props.name.length}/140`
  }

  render() {
    if (this.props.authorizedToEdit) {
      return (
        <span className="title">
          <RIETextArea value={this.props.name}
            ref={textarea => { this.textarea = textarea }}
            propName="name"
            change={this.props.onChange}
            className="titleWrapper"
            id="titleActivator"
            classEditing="riek-editing"
            editProps={{
              onKeyPress: e => {
                const ENTER = 13
                if (e.which === ENTER) {
                  e.preventDefault()
                  this.props.onChange({ name: e.target.value })
                }
              },
              onChange: e => {
                if (!this.nameCounter) return
                this.nameCounter.innerHTML = `${e.target.value.length}/140`
               }
            }}
          />
          <span className="nameCounter" ref={span => { this.nameCounter = span }}>
            {this.nameCounterText()}
          </span>
        </span>
      )
    } else {
      return (
        <span className="title">
          <span className="titleWrapper">
            {this.props.name}
          </span>
        </span>
      )
    }
  }
}


Title.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  authorizedToEdit: PropTypes.bool
}

export default Title
