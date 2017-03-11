import React, { Component, PropTypes } from 'react'

import MapInfoBox from './MapInfoBox'

class InfoAndHelp extends Component {
  static propTypes = {
    mapIsStarred: PropTypes.bool,
    currentUser: PropTypes.object,
    map: PropTypes.object,
    infoBoxOpen: PropTypes.bool
  }

  render () {
    const { mapIsStarred, map, currentUser, infoBoxOpen } = this.props
    const starclassName = mapIsStarred ? 'starred' : ''
    const tooltip = mapIsStarred ? 'Star' : 'Unstar'
    return <div className="infoAndHelp">
      {infoBoxOpen && <MapInfoBox map={map} currentUser={currentUser} />}
      <div className={`starMap infoElement mapElement ${starclassName}`}>
        <div className="tooltipsAbove">{tooltip}</div>
      </div>
      <div className="mapInfoIcon infoElement mapElement">
        <div className="tooltipsAbove">Map Info</div>
      </div>
      <div className="openCheatsheet openLightbox infoElement mapElement" data-open="cheatsheet">
        <div className="tooltipsAbove">Help</div>
      </div>
      <div className="clearfloat"></div>
    </div>
  }
}

export default InfoAndHelp
