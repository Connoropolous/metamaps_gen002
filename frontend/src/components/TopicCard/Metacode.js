/* global $ */

/*
 * Metacode selector component
 *
 * This component takes in a callback (onMetacodeClick; takes one metacode id)
 * and a list of metacode sets and renders them. If you click a metacode, it
 * passes that metacode's id to the callback.
 */

import React, { PropTypes, Component } from 'react'

class Metacode extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showMetacodeTitle: false,
      showMetacodeSelect: false
    }
  }

  metacodeOptions = () => {
    return (
      <div id="metacodeOptions">
        <ul>
          {this.props.metacodeSets.map(set => (
            <li key={set.name}>
              <span>{set.name}</span>
              <div className="expandMetacodeSet"></div>
              <ul>
                {set.metacodes.map(m => (
                  <li key={m.id}
                    onClick={() => this.props.onMetacodeClick(m.id)}
                  >
                    <img width="24" height="24" src={m.icon_path} alt={m.name} />
                    <div className="mSelectName">{m.name}</div>
                    <div className="clearfloat"></div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render = () => {
    return (
      <div className="linkItem icon"
        style={{ zIndex: this.state.showMetacodeTitle ? 4 : 1 }}
        onMouseLeave={() => this.setState({ showMetacodeTitle: false, showMetacodeSelect: false })}
      >
        <div className={`metacodeTitle mbg${this.props.metacode.get('id')}`}
          style={{ display: this.state.showMetacodeTitle ? 'block' : 'none' }}
        >
          {this.props.metacode.get('name')}
          <div className="expandMetacodeSelect"
            onClick={() => this.setState({ showMetacodeSelect: !this.state.showMetacodeSelect })}
          />
        </div>
        <div className="metacodeImage"
          style={{backgroundImage: `url(${this.props.metacode.get('icon')})`}}
          title="click and drag to move card"
          onMouseEnter={() => this.setState({ showMetacodeTitle: true })}
        />
        <div className="metacodeSelect"
          style={{ display: this.state.showMetacodeSelect ? 'block' : 'none' }}
        >
          {this.metacodeOptions()}
        </div>
      </div>
    )
  }
}

Metacode.propTypes = {
  metacode: PropTypes.object, // backbone object
  onMetacodeClick: PropTypes.func,
  metacodeSets: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    metacodes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      icon_path: PropTypes.string, // url
      name: PropTypes.string
    }))
  }))
}

export default Metacode
