import React, { Component, PropTypes } from 'react'

class MapControls extends Component {
  static propTypes = {
    onClickZoomExtents: PropTypes.func,
    onClickZoomIn: PropTypes.func,
    onClickZoomOut: PropTypes.func
  }

  render () {
    const { onClickZoomExtents, onClickZoomIn, onClickZoomOut } = this.props
    return <div className="mapControls mapElement">
      <div className="zoomExtents mapControl" onClick={onClickZoomExtents}>
        <div className="tooltips">Center View</div>
      </div>
      <div className="zoomIn mapControl" onClick={onClickZoomIn}>
        <div className="tooltips">Zoom In</div>
      </div>
      <div className="zoomOut mapControl" onClick={onClickZoomOut}>
        <div className="tooltips">Zoom Out</div>
      </div>
    </div>
  }
}

export default MapControls
