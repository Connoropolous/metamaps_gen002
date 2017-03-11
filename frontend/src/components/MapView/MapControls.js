import React, { Component, PropTypes } from 'react'

class MapControls extends Component {
  static propTypes = {
  }

  render () {
    return <div className="mapControls mapElement">
      <div className="zoomExtents mapControl"><div className="tooltips">Center View</div></div>
      <div className="zoomIn mapControl"><div className="tooltips">Zoom In</div></div>
      <div className="zoomOut mapControl"><div className="tooltips">Zoom Out</div></div>
    </div>
  }
}

export default MapControls
